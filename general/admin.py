from django.contrib import admin
from general import models
# Register your models here.


@admin.register(models.AscriptionType)
class AscriptionTypeAdmin(admin.ModelAdmin):
    """
    注册类型到admin系统进行管理
    """
    # 添加分页
    list_per_page = 1
    # 列表页展示的字段
    list_display = ('id', 'type')
    # 搜索框
    search_fields = ('id', 'type')


@admin.register(models.GeneralProgramme)
class GeneralProgrammeAdmin(admin.ModelAdmin):
    """
    注册纲领到admin系统进行管理
    """
    # 添加分页
    list_per_page = 1
    # 列表页展示的字段
    list_display = ('id', 'name', 'type', 'ascriptionType', 'reptile')
    # 搜索框
    search_fields = ('id', 'name', 'type', 'ascriptionType', 'reptile')


@admin.register(models.Rule)
class RuleAdmin(admin.ModelAdmin):
    """
    注册规则到admin系统进行管理
    """
    # 添加分页
    list_per_page = 1
    # 列表页展示的字段
    list_display = ('id', 'redBallNum', 'redBallMaxValue',
                    'blueBallNum', 'blueBallMaxValue', 'ascription')
    # 搜索框
    search_fields = ('id', 'redBallNum', 'redBallMaxValue',
                     'blueBallNum', 'blueBallMaxValue', 'ascription')


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    注册分析类型到admin系统进行管理
    """
    # 添加分页
    list_per_page = 1
    # 列表页展示的字段
    list_display = ('id', 'name', 'type', 'netPath', 'localPath', 'ascription')
    # 搜索框
    search_fields = ('id', 'name', 'type', 'ascription')


@admin.register(models.LotteryStage)
class LotteryStageAdmin(admin.ModelAdmin):
    """
    注册数据到admin系统进行管理
    """
    # 添加分页
    list_per_page = 10
    # 列表页展示的字段
    list_display = ('id', 'time', 'IssueNumber', 'MoneyBalance', 'Balance',
                    'redBall', 'blueBall', 'ascription')
    # 搜索框
    search_fields = ('id', 'time', 'MoneyBalance',
                     'Balance', 'IssueNumber', 'ascription')


@admin.register(models.Forecast)
class ForecastAdmin(admin.ModelAdmin):
    """
    注册数据到admin系统进行管理
    """
    # 添加分页
    list_per_page = 10
    # 列表页展示的字段
    list_display = ('id', 'IssueNumber', 'redBall', 'blueBall', 'ascription')
    # 搜索框
    search_fields = ('id', 'IssueNumber', 'ascription')


@admin.register(models.ColdAndHot)
class ColdAndHotAdmin(admin.ModelAdmin):
    """
    注册数据到admin系统进行管理
    """
    # 添加分页
    list_per_page = 10
    # 列表页展示的字段
    list_display = ('id', 'IssueNumber', 'redBall', 'blueBall', 'ascription')
    # 搜索框
    search_fields = ('id', 'IssueNumber', 'ascription')


@admin.register(models.KillNumberRule)
class KillNumberRuleAdmin(admin.ModelAdmin):
    """
    注册杀号规则到admin系统进行管理
    """
    # 添加分页
    list_per_page = 10
    # 列表页展示的字段
    list_display = ('id', 'name', 'format',  'param', 'ascription')
    # 搜索框
    search_fields = ('id', 'name', 'format',  'param', 'ascription')


@admin.register(models.KillNumber)
class KillNumberAdmin(admin.ModelAdmin):
    """
    注册杀号数据到admin系统进行管理
    """
    # 添加分页
    list_per_page = 10
    # 列表页展示的字段
    list_display = ('id', 'IssueNumber', 'redBall', 'blueBall', 'ascription')
    # 搜索框
    search_fields = ('id', 'IssueNumber', 'ascription')
