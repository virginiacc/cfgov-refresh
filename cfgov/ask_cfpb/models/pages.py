from __future__ import absolute_import

from django.utils import timezone
from django.db import models

from wagtail.wagtailadmin.edit_handlers import (
    FieldPanel,
    ObjectList,
    TabbedInterface)
from wagtail.wagtailcore.fields import RichTextField
from wagtail.wagtailcore.models import Page, PageManager
from wagtail.wagtailsearch import index

from v1.models import CFGOVPage
from ask_cfpb.models import Answer
from ask_cfpb.models import Category

from v1.models.snippets import ReusableText as ReusableText
from v1.atomic_elements import molecules, organisms
from v1.forms import FeedbackForm
from wagtail.contrib.wagtailroutablepage.models import RoutablePageMixin, route


class AskLandingPage(CFGOVPage):
    def get_context(self, request):
        context = super(AskLandingPage, self).get_context(request)
        context['categories'] = Category.objects.all()
        return context
    
    content_panels = CFGOVPage.content_panels
    edit_handler = TabbedInterface([
        ObjectList(content_panels, heading='Content'),
        ObjectList(CFGOVPage.settings_panels, heading='Configuration'),
    ])

    template = 'ask-landing-page/index.html'
    objects = PageManager()

    def __str__(self):
        if self.answer_base:
            return '{}: {}'.format(self.answer_base.id, self.title)
        else:
            return self.title

class AnswerPage(CFGOVPage):
    """
    Page type for Ask CFPB answers.
    """
    
    question = RichTextField(blank=True, editable=False)
    answer = RichTextField(blank=True, editable=False)
    snippet = RichTextField(
        blank=True, help_text='Optional answer intro', editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    publish_date = models.DateTimeField(default=timezone.now)
    answer_base = models.ForeignKey(
        Answer,
        blank=True,
        null=True,
        on_delete=models.PROTECT)
    related_questions = models.ManyToManyField(
        'self',
        symmetrical=False,
        blank=True,
        related_name='related_question',
        help_text='Maximum of 3')

    def get_context(self, request):
        context = super(AnswerPage, self).get_context(request)
        context['about_us'] = ReusableText.objects.filter(title="Ask CFPB about us")
        context['feedback'] = FeedbackForm()
        return context

    content_panels = CFGOVPage.content_panels + [
        FieldPanel('answer_base', Answer),
    ]
    search_fields = Page.search_fields + [
        index.SearchField('question'),
        index.SearchField('answer'),
        index.SearchField('answer_base'),
        index.FilterField('language')
    ]
    edit_handler = TabbedInterface([
        ObjectList(content_panels, heading='Content'),
        ObjectList(CFGOVPage.settings_panels, heading='Configuration'),
    ])

    template = 'ask-answer-page/index.html'
    objects = PageManager()

    def __str__(self):
        if self.answer_base:
            return '{}: {}'.format(self.answer_base.id, self.title)
        else:
            return self.title
