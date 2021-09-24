
from rest_framework import serializers
from general.models import AscriptionType, GeneralProgramme, Category, LotteryStage, Rule, Forecast, ColdAndHot, KillNumber, KillNumberRule


class AscriptionTypeSerializers(serializers.ModelSerializer):
    class Meta:
        model = AscriptionType
        fields = ('type')


class CategorySerializers(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'type', 'netPath', 'localPath', 'ascription')


class KillNumberRuleSerializers(serializers.ModelSerializer):
    class Meta:
        model = KillNumberRule
        fields = ('name', 'object',
                  'ascription')


class RuleSerializers(serializers.ModelSerializer):
    class Meta:
        model = Rule
        fields = ('redBallNum', 'redBallMaxValue',
                  'blueBallNum', 'blueBallMaxValue', 'ascription')


class GeneralProgrammeSerializers(serializers.ModelSerializer):
    children = CategorySerializers(source='Categorys', many=True)
    rule = RuleSerializers(source='Rule')
    killNumberRules = KillNumberRuleSerializers(
        source='KillNumberRules', many=True)

    class Meta:
        model = GeneralProgramme
        fields = ('name', 'type', 'ascriptionType',
                  'children', 'rule', 'reptile', 'killNumberRules')


class LotteryStageSerializers(serializers.ModelSerializer):
    class Meta:
        model = LotteryStage
        fields = ('IssueNumber',
                  'redBall', 'blueBall', 'ascription')


class ForecastSerializers(serializers.ModelSerializer):
    class Meta:
        model = Forecast
        fields = ('IssueNumber',
                  'redBall', 'blueBall', 'ascription')


class ColdAndHotSerializers(serializers.ModelSerializer):
    class Meta:
        model = ColdAndHot
        fields = ('IssueNumber',
                  'redBall', 'blueBall', 'ascription')


class KillNumberSerializers(serializers.ModelSerializer):
    lotteryStage_redBall = serializers.CharField(source='lotteryStage.redBall')
    lotteryStage_blueBall = serializers.CharField(
        source='lotteryStage.blueBall')

    class Meta:
        model = KillNumber
        fields = ('IssueNumber',
                  'redBall', 'blueBall', 'ascription', 'lotteryStage_redBall', 'lotteryStage_blueBall')
