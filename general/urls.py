from django.views.generic import TemplateView
from rest_framework import routers
from django.conf.urls import url
from django.urls import path
from django.urls import include
from . import views

app_name = 'general'

urlpatterns = [
    url(r'^clear/(?P<ascriptionType>\d+)/$',
        views.ClearViewSet.as_view()),

    url(r'^navList/$', views.NavListViewSet.as_view()),

    url(r'^CategoryList/(?P<ascriptionType>\d+)/$',
        views.CategoryListViewSet.as_view()),

    url(r'^LotteryStage/(?P<ascriptionType>\d+)/$',
        views.LotteryStageListViewSet.as_view()),

    url(r'^Forecast/(?P<ascriptionType>\d+)/$',
        views.ForecastViewSet.as_view()),

    url(r'^ColdAndHot/(?P<ascriptionType>\d+)/$',
        views.ColdAndHotViewSet.as_view()),

    url(r'^KillNumber/(?P<ascriptionType>\d+)/$',
        views.KillNumberViewSet.as_view()),

    url(r'^Surplus/(?P<ascriptionType>\d+)/$',
        views.SurplusViewSet.as_view()),

    url(r'^Quotient/(?P<ascriptionType>\d+)/$',
        views.QuotientViewSet.as_view()),
]

'''

router = routers.DefaultRouter()

router.register(r'navList', views.NavListViewSet, basename='navList')
router.register(r'CategoryList', views.CategoryListViewSet, basename='CategoryList')

urlpatterns = [
    url(r'', include(router.urls)),
]

'''
