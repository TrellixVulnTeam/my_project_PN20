
from general.serializers import GeneralProgrammeSerializers, CategorySerializers, LotteryStageSerializers, ForecastSerializers, ColdAndHotSerializers, KillNumberSerializers
from general.models import GeneralProgramme, Category, LotteryStage, Forecast, ColdAndHot, KillNumber
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from collections import OrderedDict
from rest_framework.pagination import PageNumberPagination
from general.utils import geturl
from lxml import etree
import json
import math

# Create your views here.


class AdaptPagination(PageNumberPagination):
    page_size = 10  # 每页数目
    page_query_param = 'page'  # 前端发送的页数关键字名，默认为"page"
    page_size_query_param = 'limit'  # 前端发送的每页数目关键字名，默认为None
    max_page_size = 100  # 前端最多能设置的每页数量

    def get_paginated_response(self, data):

        self.page_size = self.get_page_size(data['request'])
        return Response(OrderedDict([
            ('count', data.get('count', self.page.paginator.count)),
            ('pageSize', data.get('pageSize', self.page_size)),
            ('maxPageSize', data.get('maxPageSize', self.max_page_size)),
            ('pageQueryParam', data.get('pageQueryParam', self.page_query_param)),
            ('pageSizeQueryParam', data.get(
                'pageSizeQueryParam', self.page_size_query_param)),
            ('msg', data.get('msg', 'success')),
            ('code', data.get('code', 0)),
            ('data', data.get('data', data))
        ]))


class ClearViewSet(APIView):
    def post(self, request, *args, **kwargs):
        try:
            navList = GeneralProgramme.objects.get(
                ascriptionType__id=kwargs['ascriptionType'])
        except GeneralProgramme.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        navList.LotteryStages.all().delete()
        navList.ColdAndHots.all().delete()
        navList.KillNumbers.all().delete()

        return Response()


class NavListViewSet(APIView):
    def get(self, request):
        try:
            queryset = GeneralProgramme.objects.all()
        except GeneralProgramme.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = GeneralProgrammeSerializers(queryset, many=True)

        return Response(serializer.data)


class CategoryListViewSet(APIView):
    def get(self, request, *args, **kwargs):
        try:
            navList = GeneralProgramme.objects.get(
                ascriptionType__id=kwargs['ascriptionType'])
        except GeneralProgramme.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializers(navList.Categorys.all(), many=True)
        return Response(serializer.data)


class LotteryStageListViewSet(APIView):
    def get(self, request, *args, **kwargs):
        try:
            navList = GeneralProgramme.objects.get(
                ascriptionType__id=kwargs['ascriptionType'])
        except GeneralProgramme.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        LotteryStages = navList.LotteryStages.all()
        p = AdaptPagination()
        # 在数据库中获取分页数据
        pager_roles = p.paginate_queryset(
            queryset=LotteryStages, request=request, view=self)

        if pager_roles is not None:
            serializer = LotteryStageSerializers(
                instance=pager_roles, many=True)
            data = {
                'request': request,
                'msg': '成功',
                'code': 0,
                'data': serializer.data
            }
            return p.get_paginated_response(data)

        serializer = LotteryStageSerializers(
            navList.LotteryStages.all(), many=True)
        return Response(serializer.data)

    """
    爬虫执行开关
    """

    def post(self, request, *args, **kwargs):
        limit = request.query_params['limit'] if request.query_params['limit'] != None else 2001
        url = request.query_params['url']

        urldata = geturl(url+'?limit='+limit)
        # 解析数据并存入数据库
        alldata = etree.HTML(urldata)

        newestIssueNumber = int(alldata.xpath(
            r'//*[@id="tdata"]/tr['+str(1)+']/td[1]')[0].text)

        newest = LotteryStage.objects.filter(
            IssueNumber=newestIssueNumber, ascription__id=kwargs['ascriptionType']).first()

        lotteryStages = LotteryStage.objects.filter(
            ascription__id=kwargs['ascriptionType'])

        if newest != None and lotteryStages.count() == limit:
            return Response('已经是最新状态')

        lastIssueNumber = int(alldata.xpath(
            r'//*[@id="tdata"]/tr['+str(int(limit))+']/td[1]')[0].text)

        LotteryStage.objects.filter(
            ascription__id=kwargs['ascriptionType'], IssueNumber__lt=lastIssueNumber).delete()

        for i in range(int(limit), 0, -1):
            path = dict()
            path['path1'] = r'//*[@id="tdata"]/tr['+str(i)+']/td[1]'
            path['path2'] = r'//*[@id="tdata"]/tr['+str(i)+']/td[2]'
            path['path3'] = r'//*[@id="tdata"]/tr['+str(i)+']/td[3]'
            path['path4'] = r'//*[@id="tdata"]/tr['+str(i)+']/td[4]'
            path['path5'] = r'//*[@id="tdata"]/tr['+str(i)+']/td[5]'
            path['path6'] = r'//*[@id="tdata"]/tr['+str(i)+']/td[6]'
            path['path7'] = r'//*[@id="tdata"]/tr['+str(i)+']/td[7]'
            path['path8'] = r'//*[@id="tdata"]/tr['+str(i)+']/td[8]'
            ordernum = int(alldata.xpath(path['path1'])[0].text)

            lotteryStage = LotteryStage.objects.filter(
                IssueNumber=ordernum, ascription__id=kwargs['ascriptionType']).first()
            if lotteryStage == None:
                lotteryStage = LotteryStage(
                    ascription_id=kwargs['ascriptionType'])

                lotteryStage.IssueNumber = ordernum
                lotteryStage.ascription_id = kwargs['ascriptionType']
                rule = lotteryStage.ascription.Rule
                lotteryStage.redBall = []
                lotteryStage.blueBall = []
                for j in range(2, 2+int(rule.redBallNum)):
                    lotteryStage.redBall.append(
                        int(alldata.xpath(path['path'+str(j)])[0].text))

                for k in range(2+int(rule.redBallNum), 2+int(rule.redBallNum)+int(rule.blueBallNum)):
                    lotteryStage.blueBall.append(
                        int(alldata.xpath(path['path'+str(k)])[0].text))

                lotteryStage.save()

        return Response()


class ForecastViewSet(APIView):
    def get(self, request, *args, **kwargs):
        try:
            navList = GeneralProgramme.objects.get(
                ascriptionType__id=kwargs['ascriptionType'])
        except GeneralProgramme.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        Forecasts = navList.Forecasts.all()
        p = AdaptPagination()
        # 在数据库中获取分页数据
        pager_roles = p.paginate_queryset(
            queryset=Forecasts, request=request, view=self)

        if pager_roles is not None:
            serializer = ForecastSerializers(
                instance=pager_roles, many=True)
            data = {
                'request': request,
                'msg': '成功',
                'code': 0,
                'data': serializer.data
            }
            return p.get_paginated_response(data)

        serializer = ForecastSerializers(Forecasts, many=True)
        return Response(serializer.data)


class ColdAndHotViewSet(APIView):
    def get(self, request, *args, **kwargs):
        try:
            navList = GeneralProgramme.objects.get(
                ascriptionType__id=kwargs['ascriptionType'])
        except GeneralProgramme.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        ColdAndHots = navList.ColdAndHots.all()
        p = AdaptPagination()
        # 在数据库中获取分页数据
        pager_roles = p.paginate_queryset(
            queryset=ColdAndHots, request=request, view=self)

        if pager_roles is not None:
            serializer = ColdAndHotSerializers(
                instance=pager_roles, many=True)
            data = {
                'request': request,
                'msg': '成功',
                'code': 0,
                'data': serializer.data
            }
            return p.get_paginated_response(data)

        serializer = ColdAndHotSerializers(
            ColdAndHots, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        try:
            navList = GeneralProgramme.objects.get(
                ascriptionType__id=kwargs['ascriptionType'])
        except GeneralProgramme.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        LotteryStages = navList.LotteryStages.all().order_by(
            '-IssueNumber')

        if LotteryStages.count() < 10:
            return Response('数据数量'+str(LotteryStages.count())+'太少，不足已计算出冷热分析表')

        Rule = navList.Rule
        index = 0

        for lottery in LotteryStages:

            if index + 10 > LotteryStages.count():
                break

            arr = []
            for i in range(index, index+10):
                arr.append(LotteryStages[i])

            index = index + 1

            coldAndHot = ColdAndHot.objects.filter(
                IssueNumber=lottery.IssueNumber, ascription__id=kwargs['ascriptionType']).first()

            if coldAndHot == None:
                coldAndHot = ColdAndHot(
                    ascription_id=kwargs['ascriptionType'])

                coldAndHot.IssueNumber = lottery.IssueNumber
                coldAndHot.ascription = lottery.ascription
                coldAndHot.lotteryStage = lottery
                coldAndHot.redBall = []
                coldAndHot.blueBall = []

                for j in range(0, int(Rule.redBallMaxValue)):
                    red_num = 0
                    red_index = 1
                    red_value = 0
                    red_hasFind = False
                    for item in arr:
                        redArr = json.loads(item.redBall)
                        for redCell in redArr:
                            if int(redCell) == j+1:
                                red_num = red_num + 1
                                break
                        if red_index <= 5 and red_num >= 2 and red_hasFind == False:
                            red_hasFind = True
                            break
                        red_index = red_index + 1
                    if red_num == 0:
                        red_value = -1
                    elif red_num <= 2 and red_hasFind == False:
                        red_value = 0
                    else:
                        red_value = 1
                    coldAndHot.redBall.append(red_value)

                for k in range(0, int(Rule.blueBallMaxValue)):
                    blue_num = 0
                    blue_index = 1
                    blue_value = 0
                    blue_hasFind = False
                    for item in arr:
                        blueArr = json.loads(item.blueBall)
                        for blueCell in blueArr:
                            if int(blueCell) == k+1:
                                blue_num = blue_num + 1
                                break
                        if blue_index <= 5 and blue_num >= 2 and blue_hasFind == False:
                            blue_hasFind = True
                            break
                        blue_index = blue_index + 1
                    if blue_num == 0:
                        blue_value = -1
                    elif blue_num <= 2 and blue_hasFind == False:
                        blue_value = 0
                    else:
                        blue_value = 1
                    coldAndHot.blueBall.append(blue_value)

                coldAndHot.save()

        return Response()


class KillNumberViewSet(APIView):
    def get(self, request, *args, **kwargs):
        try:
            navList = GeneralProgramme.objects.get(
                ascriptionType__id=kwargs['ascriptionType'])
        except GeneralProgramme.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        KillNumbers = navList.KillNumbers.all()
        p = AdaptPagination()
        # 在数据库中获取分页数据
        pager_roles = p.paginate_queryset(
            queryset=KillNumbers, request=request, view=self)

        if pager_roles is not None:
            serializer = KillNumberSerializers(
                instance=pager_roles, many=True)
            data = {
                'request': request,
                'msg': '成功',
                'code': 0,
                'data': serializer.data
            }
            return p.get_paginated_response(data)

        serializer = KillNumberSerializers(
            KillNumbers, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        try:
            navList = GeneralProgramme.objects.get(
                ascriptionType__id=kwargs['ascriptionType'])
        except GeneralProgramme.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        LotteryStages = navList.LotteryStages.all().order_by(
            'IssueNumber')

        if LotteryStages.count() <= 1:
            return Response('数据数量'+str(LotteryStages.count())+'太少，不足已计算出杀号分析表')

        killNumberRules = navList.KillNumberRules.all()

        if killNumberRules.count() <= 0:
            return Response('规则数量'+str(killNumberRules.count())+'太少，不足已计算出杀号分析表')

        index = 0

        for lottery in LotteryStages:
            killNumber = KillNumber.objects.filter(
                IssueNumber=lottery.IssueNumber, ascription__id=kwargs['ascriptionType']).first()

            if killNumber == None:
                killNumber = KillNumber(
                    ascription_id=kwargs['ascriptionType'])

            killNumber.IssueNumber = lottery.IssueNumber
            killNumber.ascription = lottery.ascription
            killNumber.lotteryStage = lottery
            killNumber.redBall = []
            killNumber.blueBall = []

            for rule in killNumberRules:
                killNumberFormat = rule.format
                killNumberParam = rule.param.split(',')
                killNumberObject = rule.object
                paramArr = []
                for param in killNumberParam:
                    val = 0
                    if param.find('rll') != -1:
                        if index-2 >= 0:
                            val = json.loads(
                                LotteryStages[index-2].redBall)[int(param[3:])-1]
                    elif param.find('rl') != -1:
                        if index-1 >= 0:
                            val = json.loads(
                                LotteryStages[index-1].redBall)[int(param[2:])-1]
                    elif param.find('r') != -1:
                        val = json.loads(lottery.redBall)[int(param[1:])-1]
                    elif param.find('bll') != -1:
                        if index-2 >= 0:
                            val = json.loads(
                                LotteryStages[index-2].blueBall)[int(param[3:])-1]
                    elif param.find('bl') != -1:
                        if index-1 >= 0:
                            val = json.loads(
                                LotteryStages[index-1].blueBall)[int(param[2:])-1]
                    elif param.find('b') != -1:
                        val = json.loads(lottery.blueBall)[
                            int(param[1:])-1]

                    paramArr.append(val)

                value = int(eval(killNumberFormat.format(paramArr)))
                if killNumberObject == 0:
                    killNumber.redBall.append(value)
                elif killNumberObject == 1:
                    killNumber.blueBall.append(value)
                else:
                    killNumber.redBall.append(value)
                    killNumber.blueBall.append(value)

            index = index + 1

            killNumber.save()

        return Response()


class SurplusViewSet(APIView):
    def get(self, request, *args, **kwargs):
        try:
            navList = GeneralProgramme.objects.get(
                ascriptionType__id=kwargs['ascriptionType'])
        except GeneralProgramme.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        LotteryStages = navList.LotteryStages.all()
        p = AdaptPagination()
        # 在数据库中获取分页数据
        pager_roles = p.paginate_queryset(
            queryset=LotteryStages, request=request, view=self)

        if pager_roles is not None:
            serializer = LotteryStageSerializers(
                instance=pager_roles, many=True)
            data = {
                'request': request,
                'msg': '成功',
                'code': 0,
                'data': serializer.data
            }
            return p.get_paginated_response(data)

        serializer = LotteryStageSerializers(
            navList.LotteryStages.all(), many=True)
        return Response(serializer.data)


class QuotientViewSet(APIView):
    def get(self, request, *args, **kwargs):
        try:
            navList = GeneralProgramme.objects.get(
                ascriptionType__id=kwargs['ascriptionType'])
        except GeneralProgramme.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        LotteryStages = navList.LotteryStages.all()
        p = AdaptPagination()
        # 在数据库中获取分页数据
        pager_roles = p.paginate_queryset(
            queryset=LotteryStages, request=request, view=self)

        if pager_roles is not None:
            serializer = LotteryStageSerializers(
                instance=pager_roles, many=True)
            data = {
                'request': request,
                'msg': '成功',
                'code': 0,
                'data': serializer.data
            }
            return p.get_paginated_response(data)

        serializer = LotteryStageSerializers(
            navList.LotteryStages.all(), many=True)
        return Response(serializer.data)
