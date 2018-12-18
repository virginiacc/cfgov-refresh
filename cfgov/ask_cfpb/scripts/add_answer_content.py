# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging
from wagtail.wagtailcore.blocks import StreamValue
from ask_cfpb.models.pages import AnswerPage

def run():
    pages = AnswerPage.objects.all()
    for page in pages:
        text = {
            'type': 'text',
            'value': page.answer
        }
        content = page.answer_content.stream_data
        content.insert(0, text)
        
        revision = page.save_revision()
        page.save()
        revision.publish()
