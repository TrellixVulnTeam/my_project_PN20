
from rest_framework import serializers
from general.models import AscriptionType, GeneralProgramme, Category, LotteryStage, Rule, ColdAndHot, KillNumber, KillNumberRule


# class DynamicFieldsModelSerializer(serializers.ModelSerializer):
#     def __init__(self, *args, **kwargs):
#         fields = kwargs.pop('fields', None)  # 提取fields

#         # 实例化父类
#         super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

#         if fields is not None:
#             # 删除fields参数中未指定的任何字段
#             allowed = set(fields)
#             existing = set(self.fields.keys())
#             if allowed:
#                 for field_name in existing - allowed:
#                     self.fields.pop(field_name)
#             else:
#                 # fields参数为空，则取全部字段
#                 pass


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
        fields = ('IssueNumber', 'time', 'MoneyBalance', 'Balance',
                  'redBall', 'blueBall', 'ascription')


class ColdAndHotSerializers(serializers.ModelSerializer):
    class Meta:
        model = ColdAndHot
        fields = ('IssueNumber',
                  'redBall', 'blueBall', 'ascription')


class KillNumberSerializers(serializers.ModelSerializer):
    lotteryStage_redBall = serializers.CharField(
        required=False, source='lotteryStage.redBall')
    lotteryStage_blueBall = serializers.CharField(required=False,
                                                  source='lotteryStage.blueBall')

    class Meta:
        model = KillNumber
        fields = ('IssueNumber',
                  'redBall', 'blueBall', 'ascription', 'lotteryStage_redBall', 'lotteryStage_blueBall')
