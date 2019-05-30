""" This data migration converts Link Blob Groups to Info Unit Groups.

The HalfWidthLinkBlobGroup and ThirdWidthLinkBlobGroup organisms
have the following format:

{
    # string, not required
    'heading': 'Heading',

    # boolean, not required, defaults to False
    'has_top_border': True,

    # boolean, not required, defaults to False
    'has_bottom_border': False,

    # ListBlock of HalfWidthLinkBlob molecules
    'link_blobs': [
        {
            # string, not required
            'heading': 'Heading (level 3)',

            # string, not required
            'sub_heading': 'Heading (level 4)',

            # string, not required
            'sub_heading_icon': 'help-round',

            # rich text, not required
            'body': '<p>HTML text</p>',

            # ListBlock of Hyperlink atoms
            'links': [
                {
                    'text': 'Link text'
                    'url': '/path/to/something/'
                },
                ...
            ]
        },
        ...
    ]
}


The InfoUnitGroup organism has the following format:

{
    # ChoiceBlock; choices of '50-50', '25-75', or '33-33-33'; required
    format: '50-50',

    # HeadingBlock
    'heading': {
        # string, not required
        'text': 'Heading',

        # ChoiceBlock; choices of 'h2', 'h3', or 'h4'; not required
        'level': 'h2'

        # string, not required
        'icon': 'help-round'
    },

    # rich text, not required
    'intro': '<p>HTML text</p>',

    # boolean, not required, defaults to True
    'link_image_and_heading': True,

    # boolean, not required, defaults to False
    'has_top_rule_line': False,

    # boolean, not required, defaults to False
    'lines_between_items': False,

    # ListBlock of InfoUnit molecules
    'info_units': [
        {
            # ImageBasic atom
            'image': <ImageBasic PK>,

            # HeadingBlock
            'heading': {
                # string, not required
                'text': 'Heading',

                # ChoiceBlock; choices of 'h2', 'h3', or 'h4'; not required
                'level': 'h3'

                # string, not required
                'icon': 'help-round'
            },

            # rich text, not required
            'body': '<p>HTML text</p>',

            # ListBlock of Hyperlink atoms
            'links': [
                {
                    'text': 'Link text'
                    'url': '/path/to/something/'
                },
                ...
            ]
        },
        ...
    ],

    # StructBlock
    'sharing': {
        # boolean, not required, defaults to False
        'shareable': False

        # string, not required
        'share_blurb': 'Tweet text, e-mail subject line, and LinkedIn post'
    }
}
"""


from django.db import migrations

from v1.util.migrations import get_stream_data, set_stream_data


def link_blob_group_to_info_unit_group(old_value, new_format):
    new_value = {}

    # Convert basic heading CharBlock to HeadingBlock.
    if old_value.get('heading'):
        new_value['heading'] = {
            'text': old_value['heading'],
            'level': 'h2',
        }

    # Change of block name.
    if old_value.get('has_top_border'):
        new_value['has_top_rule_line'] = old_value['has_top_border']

    # If any link_blobs were defined, process those.
    if old_value.get('link_blobs'):
        link_blobs = old_value['link_blobs']
        info_units = []

        for link_blob in link_blobs:
            info_unit = {}

            # Convert basic heading or sub_heading to HeadingBlock.
            if link_blob.get('heading'):
                info_unit['heading'] = {
                    'text': link_blob['heading'],
                    'level': 'h3',
                }
            elif link_blob.get('sub_heading'):
                heading_icon = link_blob.get('sub_heading_icon')
                info_unit['heading'] = {
                    'text': link_blob['sub_heading'],
                    'level': 'h4',
                    'icon': heading_icon
                }

            # Fields that need no manipulation: body, links
            if link_blob.get('body'):
                info_unit['body'] = link_blob['body']
            if link_blob.get('links'):
                info_unit['links'] = link_blob['links']
            else:
                info_unit['links'] = []

            # If at least one field was copied
            if info_unit:
                info_units.append(info_unit)

        new_value['info_units'] = info_units

    # Prevent link_image_and_heading from defaulting to True
    new_value['link_image_and_heading'] = False

    # Add new required field: format
    new_value['format'] = new_format

    # Fields being discarded: has_bottom_border.

    return new_value


def migrate_streamfield_forward(page_or_revision, streamfield_name):
    """ Migrate a StreamField belonging to the page or revision """
    old_stream_data = get_stream_data(page_or_revision, streamfield_name)

    new_stream_data = []
    migrated = False

    block_conversions = {
        'half_width_link_blob_group': '50-50',
        'third_width_link_blob_group': '33-33-33',
    }

    for block in old_stream_data:
        block_type = block['type']

        if block_type in block_conversions:
            new_block = {
                'type': 'info_unit_group',
                'value': link_blob_group_to_info_unit_group(
                    block['value'],
                    block_conversions[block_type]
                )
            }

            new_stream_data.append(new_block)
            migrated = True
        else:
            new_stream_data.append(block)

    if migrated:
        set_stream_data(
            page_or_revision,
            streamfield_name,
            new_stream_data
        )


def forwards(apps, schema_editor):
    models_and_fields = [
        ('v1', 'BrowsePage', 'content'),
        ('v1', 'LandingPage', 'content'),
        ('v1', 'SublandingPage', 'content'),
    ]

    revision_model = apps.get_model('wagtailcore.PageRevision')

    for app, page_type, streamfield_name in models_and_fields:
        page_model = apps.get_model(app, page_type)

        for page in page_model.objects.all():
            migrate_streamfield_forward(page, streamfield_name)

            # Migrate revisions
            revisions = revision_model.objects.filter(
                page=page).order_by('-id')
            for revision in revisions:
                migrate_streamfield_forward(revision, streamfield_name)


class Migration(migrations.Migration):

    dependencies = [
        ('v1', '0137_migrate_imagetextgroups_to_infounitgroup'),
    ]

    operations = [
         migrations.RunPython(forwards, migrations.RunPython.noop),
    ]
