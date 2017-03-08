# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('v1', '0058_adding_clickable_image_to_50_50'),
        ('ask_cfpb', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AskLandingPage',
            fields=[
                ('cfgovpage_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='v1.CFGOVPage')),
            ],
            options={
                'abstract': False,
            },
            bases=('v1.cfgovpage',),
        ),
        migrations.AddField(
            model_name='answerpage',
            name='related_questions',
            field=models.ManyToManyField(help_text=b'Maximum of 3', related_name='related_question', to='ask_cfpb.AnswerPage', blank=True),
        ),
    ]
