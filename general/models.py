from django.db import models
from django.core.validators import int_list_validator

# Create your models here.


class AscriptionType(models.Model):
    type = models.IntegerField(verbose_name='类型', default=0)

    class Meta:
        ordering = ('type',)


class GeneralProgramme(models.Model):
    name = models.CharField(verbose_name='纲领', max_length=100, default='')
    type = models.CharField(verbose_name='图标类型', max_length=100, default='')
    reptile = models.CharField(verbose_name='爬虫地址', max_length=100, default='')
    ascriptionType = models.ForeignKey(
        to='AscriptionType', on_delete=models.CASCADE, related_name='GeneralProgrammes', default=None)

    class Meta:
        ordering = ('ascriptionType',)


class Rule(models.Model):
    redBallNum = models.IntegerField(verbose_name='红球数量', default=0)
    redBallMaxValue = models.IntegerField(verbose_name='红球最大值', default=0)
    blueBallNum = models.IntegerField(verbose_name='蓝球数量', default=0)
    blueBallMaxValue = models.IntegerField(verbose_name='蓝球最大值', default=0)
    ascription = models.OneToOneField(
        to='GeneralProgramme', on_delete=models.CASCADE, related_name='Rule', default=None)

    class Meta:
        ordering = ('ascription',)


class Category(models.Model):
    name = models.CharField(verbose_name='名字', max_length=100, default='')
    type = models.CharField(verbose_name='图标类型', max_length=100, default='')
    netPath = models.CharField(verbose_name='网络路径', max_length=100, default='')
    localPath = models.CharField(
        verbose_name='本地路径', max_length=100, default='')
    ascription = models.ForeignKey(
        to='GeneralProgramme', on_delete=models.CASCADE, related_name='Categorys', default=None)

    class Meta:
        ordering = ('id',)


class LotteryStage(models.Model):
    ascription = models.ForeignKey(
        to='GeneralProgramme', on_delete=models.CASCADE, related_name='LotteryStages', default=None)
    IssueNumber = models.IntegerField(verbose_name='期号', default='')
    redBall = models.CharField(verbose_name='红球', validators=[
                               int_list_validator], max_length=100, default=[])
    blueBall = models.CharField(verbose_name='蓝球', validators=[
                                int_list_validator], max_length=100, default=[])

    class Meta:
        ordering = ('-IssueNumber',)


class Forecast(models.Model):
    ascription = models.ForeignKey(
        to='GeneralProgramme', on_delete=models.CASCADE, related_name='Forecasts', default=None)
    IssueNumber = models.IntegerField(verbose_name='期号', default='')
    redBall = models.CharField(verbose_name='红球', validators=[
                               int_list_validator], max_length=100, default=[])
    blueBall = models.CharField(verbose_name='蓝球', validators=[
                                int_list_validator], max_length=100, default=[])

    class Meta:
        ordering = ('IssueNumber',)


class ColdAndHot(models.Model):
    ascription = models.ForeignKey(
        to='GeneralProgramme', on_delete=models.CASCADE, related_name='ColdAndHots', default=None)
    IssueNumber = models.IntegerField(verbose_name='期号', default='')
    redBall = models.CharField(verbose_name='红球', validators=[
                               int_list_validator], max_length=255, default=[])
    blueBall = models.CharField(verbose_name='蓝球', validators=[
                                int_list_validator], max_length=100, default=[])
    lotteryStage = models.OneToOneField(
        to='LotteryStage', on_delete=models.CASCADE, related_name='ColdAndHot', default=None)

    class Meta:
        ordering = ('-IssueNumber',)


class KillNumberRule(models.Model):
    ascription = models.ForeignKey(
        to='GeneralProgramme', on_delete=models.CASCADE, related_name='KillNumberRules', default=None)
    name = models.CharField(verbose_name='杀号方法名', max_length=100, default='')
    object = models.IntegerField(verbose_name='杀号对象', default=0)
    format = models.CharField(verbose_name='杀号格式', max_length=100, default='')
    param = models.CharField(verbose_name='杀号参数', max_length=100, default='')

    class Meta:
        ordering = ('name',)


class KillNumber(models.Model):
    ascription = models.ForeignKey(
        to='GeneralProgramme', on_delete=models.CASCADE, related_name='KillNumbers', default=None)
    IssueNumber = models.IntegerField(verbose_name='期号', default='')
    redBall = models.CharField(verbose_name='红球', validators=[
                               int_list_validator], max_length=256, default=[])
    blueBall = models.CharField(verbose_name='蓝球', validators=[
                                int_list_validator], max_length=100, default=[])
    lotteryStage = models.OneToOneField(
        to='LotteryStage', on_delete=models.CASCADE, related_name='KillNumber', default=None, null=True)

    class Meta:
        ordering = ('-IssueNumber',)
