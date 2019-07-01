from __future__ import unicode_literals
import datetime
from dateutil import parser

from core.utils import format_file_size
from django.db import models


def ap_date(date):
    """Convert a date object or date string into an AP-styled date string."""
    if date is None:
        return None
    if type(date) != datetime.date:
        try:
            date = parser.parse(date).date()
        except ValueError:
            print("Must provide a datetime object or a valid date string")
            return
    if date.month in [3, 4, 5, 6, 7]:
        return date.strftime("%B {}, %Y").format(date.day)
    elif date.month == 9:
        return date.strftime("Sept. {}, %Y").format(date.day)
    else:
        return date.strftime("%b. {}, %Y").format(date.day)


class Prepaid(models.Model):
    name = models.CharField(blank=True, max_length=255)
    product_name = models.CharField(blank=True, max_length=255)
    other_relevant_parties = models.TextField(blank=True)
    status = models.TextField(blank=True)
    issuer = models.CharField(max_length=255, blank=True)
    issuer_name = models.CharField(max_length=255, blank=True)
    program_type = models.CharField(max_length=255, blank=True)
    withdrawal_date = models.DateField(blank=True, null=True)
    program_manager = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['product_name']

class Entity(models.Model):
    name = models.CharField(max_length=255, blank=True)
    salesforce_id = models.CharField(max_length=255, blank=True)


# class CreditBase(models.Model):
#     """An abstract base class for all credit-card and prepay models."""
#     name = models.TextField(max_length=500, blank=True)
#     slug = models.SlugField(max_length=100, db_index=True)

#     def __str__(self):
#         return self.name

#     class Meta:
#         abstract = True
#         ordering = ['name']


# class Issuer(CreditBase):
#     med_id = models.BigIntegerField(blank=True, null=True)

#     @property
#     def plan_ids(self):
#         return [plan.pk for plan in self.creditplan_set.all()]

#     @property
#     def payload(self):
#         return {
#             'name': self.name,
#             'slug': self.slug,
#             'pk': self.pk,
#             'credit_agreements': [a.uri for a
#                                   in self.agreement_set.all()],
#             'plan_ids': self.plan_ids}


# class PlanBase(CreditBase):
#     issuer = models.ForeignKey(Issuer)
#     offered = models.DateField(blank=True, null=True)
#     withdrawn = models.DateField(blank=True, null=True)

#     @property
#     def active_intake_date(self):
#         if not self.agreement_set.all():
#             return None
#         intake_dates = sorted(
#             set([a.offered for a in self.agreement_set.all()]), reverse=True)
#         return intake_dates[0]

#     @property
#     def payload(self):
#         active_date = self.active_intake_date
#         return {'name': self.name,
#                 'pk': self.pk,
#                 'slug': self.slug,
#                 'issuer': self.issuer.name,
#                 'offered': ap_date(self.offered),
#                 'withdrawn': ap_date(self.withdrawn),
#                 'active_agreement_date': ap_date(active_date),
#                 'agreements': [
#                     {'posted': ap_date(a.posted),
#                      'id': a.pk,
#                      'size': format_file_size(a.size),
#                      'effective_string': a.effective_string,
#                      'uri': a.uri} for a
#                     in self.agreement_set.all()
#                 ],
#                 'active_agreements': [
#                     {'posted': ap_date(a.posted),
#                      'id': a.pk,
#                      'size': format_file_size(a.size),
#                      'effective_string': a.effective_string,
#                      'uri': a.uri} for a
#                     in self.agreement_set.filter(posted=active_date)
#                 ],
#                 'inactive_agreements': [
#                     {'posted': ap_date(a.posted),
#                      'id': a.pk,
#                      'size': format_file_size(a.size),
#                      'effective_string': a.effective_string,
#                      'uri': a.uri} for a
#                     in self.agreement_set.exclude(posted=active_date)
#                 ]}

#     class Meta:
#         abstract = True


# class CreditPlan(PlanBase):

#     class Meta:
#         ordering = ['offered', 'name']


# class PrepayPlan(PlanBase):
#     plan_type = models.CharField(max_length=255, blank=True)

#     class Meta:
#         ordering = ['offered', 'name']


# class AgreementBase(models.Model):
#     issuer = models.ForeignKey(Issuer, null=True)
#     file_name = models.TextField(
#         max_length=500, help_text='To support legacy processing')
#     size = models.IntegerField()
#     uri = models.URLField(max_length=500)
#     description = models.TextField(
#         blank=True, help_text='To support legacy processing')
#     offered = models.DateField(blank=True, null=True)
#     withdrawn = models.DateField(blank=True, null=True)
#     posted = models.DateField(
#         null=True,
#         help_text='For legacy PDFs, this is the S3 posting date; '
#                   'for SalesForce PDFs, this is the uploaded date')

#     def __str__(self):
#         return self.file_name

#     class Meta:
#         abstract = True
#         ordering = ['-posted']

#     @property
#     def effective_string(self):
#         if not self.withdrawn:
#             return "Effective {}".format(
#                 ap_date(self.posted))
#         else:
#             return "Effective {}-{}".format(
#                 ap_date(self.posted),
#                 ap_date(self.withdrawn))

#     @property
#     def payload(self):
#         return {'issuer': self.issuer.name,
#                 'issuer_slug': self.issuer.slug,
#                 'issuer_pk': self.issuer.pk,
#                 'name': self.file_name,
#                 'size': format_file_size(self.size),
#                 'uri': self.uri,
#                 'offered': '{}'.format(ap_date(self.offered)),
#                 'withdrawn': '{}'.format(ap_date(self.withdrawn)),
#                 'effective_string': self.effective_string,
#                 'posted': '{}'.format(ap_date(self.posted)),
#                 }


# class Agreement(AgreementBase):
#     plan = models.ForeignKey(CreditPlan, null=True)
#     legacy = models.BooleanField(
#         default=False, help_text='Marker for pre-SalesForce PDFs')

#     @property
#     def payload(self):
#         data = super(Agreement, self).payload
#         if self.plan:
#             data.update({'plan': self.plan.name, 'pk': self.pk})
#         else:
#             data.update({'plan': None, 'pk': self.pk})

#         return data


# class PrepayAgreement(AgreementBase):
#     plan = models.ForeignKey(PrepayPlan, null=True)
#     name = models.CharField(blank=True, max_length=500)

#     @property
#     def payload(self):
#         data = super(PrepayAgreement, self).payload
#         if self.plan:
#             data.update({
#                 'name': self.name,
#                 'plan': self.plan.name,
#                 'pk': self.pk})
#         else:
#             data.update({
#                 'name': self.name,
#                 'plan': None,
#                 'pk': self.pk})
#         return data
