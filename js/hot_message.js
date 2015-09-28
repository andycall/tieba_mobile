    /**
 * @file 热点聚焦模块
 */
(function ($, _, Backbone, Swiper, EventProxy, topicURL, relativeFormURL, relativeThreadURL, godReplyURL) {
    'use strict';

    function getParameterByName(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    var godModel;
    var recommendModel;
    var $godTemplate;
    var $god;
    var $recommendTemplate;
    var $navigator;
    var $navigatorTemplate;
    var $recommend;
    var $relative;
    var $relativeTemplate;
    var navigatorModel;
    var relativeModel;
    var topicId = getParameterByName('topic_id');
    var eventproxy = new EventProxy();
    var relativeView;
    var navigatorView;
    var recommendView;
    var godReplyView;

    Backbone.emulateHTTP = true;
    var $loading = $('#loading');

    var BaseModel = Backbone.Model.extend({
        idAttribute: 'topic_id',
        initialize: function (options) {
            var self = this;
            this.fetch({
                data: $.param(this.get('requestData')),
                success: function () {
                    self.afterFetch();
                },
                error: function (model, xhr) {
                    console.error('Network Error, URL:', xhr.responseURL,  xhr.status, xhr.statusText);
                }
            });
            _.extend(this, _.pick(options, 'afterFetch'));
        },
        afterFetch: function () {},
        defaults: {
            requestData: {
                topic_id: topicId
            }
        }
    });

    var BaseView = Backbone.View.extend({
        initialize: function (options) {
            this.model.on('change', this.render, this);
            _.extend(this, _.pick(options, 'key', 'templatHtml', 'special', 'beforeRender'));
        },
        render: function () {
            this.beforeRender();
            var self = this;
            var data = {};
            data[this.key] = this.model.toJSON().data;
            $(this.el).html(_.template(self.templatHtml)(data));

        },
        beforeRender: function () {},
        // 点赞,关注等统计接口
        special: function (config) {
            var self = this;

            var successHandler = config.success || function () {};
            var errorHandler = config.error || function () {};

            _.extend(config, {
                method: config.method,
                url: config.url,
                success: function () {
                    $loading.hide();
                    self.model.fetch({
                        data: $.param(self.model.get('requestData'))
                    });
                    successHandler.apply(self, arguments);
                },
                error: function () {
                    $loading.hide();
                    errorHandler.apply(self, arguments);
                }
            });

            $loading.show();
            $.ajax(config);
        }
    });

    var NavigatorModel = BaseModel.extend({
        url: topicURL,
        getCommentCount: function () {
            var tmpData = this.get('data');
            var postNumCoefficient = tmpData.ret[0].post_num_coefficient;
            var postNum = 0;

            _.each(relativeModel.get('data').ret, function (val) {
                postNum += parseInt(val.post_num, 10);
            });
            tmpData.ret[0].commentCount = postNumCoefficient * postNum;

            this.set('data', tmpData);
        },
        afterFetch: function () {
            var topicType = this.get('data').ret[0]['topic_type'];

            if (parseInt(topicType, 10) !== 1) {
                $('body').html('');
                if (window.refer !== '') {
                    location.href = window.refer;
                }
                else {
                    location.href = 'http://tieba.baidu.com';
                }
            }
        }
    });

    var NavigatorView = BaseView.extend({
        beforeRender: function () {
            this.model.getCommentCount();
        }
    });

    var RecommendModel = BaseModel.extend({
        url: relativeFormURL
    });

    var RecommendView = BaseView.extend({
        beforeRender: function () {
            var tmpData = this.model.get('data');
            tmpData['relate_forum_title'] = navigatorModel.get('data').ret[0]['relate_forum_title']
                || navigatorModel.get('data').ret[0]['topic_name'];
            this.model.set(tmpData);
        },
        render: function () {
            this.beforeRender();
            var self = this;
            var data = {};
            data[this.key] = this.model.toJSON();
            $(this.el).html(_.template(self.templatHtml)(data));

            if (_.keys(data[this.key].data.output).length <= 4) {

                new Swiper('.slider-container', {
                    pagination: '.swiper-pagination'
                });
            }
        },
        events: {
            'click .focus': 'focusHandler'
        },

        focusHandler: function (e) {
            var uid = this.model.get('data').user.uid;
            var tbs = this.model.get('data').wreq.tbs;
            var kw = e.target.dataset.kw;
            var fid = e.target.dataset.fid;
            var isLogin = this.model.get('data').user.is_login;
            var target = e.target;

            if (!isLogin) {
                location.href = window.loginUrl;
            } else {
                this.special({
                    url: '/mo/q/favolike',
                    method: 'GET',
                    data: {
                        fid: fid,
                        kw: kw,
                        uid: uid,
                        itb_tbs: tbs
                    },
                    success: function () {
                        $(target).parents('.media-right').html('<p class="all">已关注</p>');
                    }
                });
            }
        }
    });

    var GodReplyView = BaseView.extend({
        beforeRender: function () {
            var tmpDa = this.model.get('data');
            tmpDa['magic_title'] = navigatorModel.get('data').ret[0].magic_title
                || navigatorModel.get('data').ret[0].topic_name;
            this.model.set(tmpDa);
        }
    });

    var GodReplyModel = BaseModel.extend({
        url: godReplyURL
    });

    var RelativeModel = BaseModel.extend({
        url: relativeThreadURL,
        defaults: {
            requestData: {
                topic_id: topicId,
                page: 1,
                num: 10
            }
        }
    });

    var RelativeView = BaseView.extend({});

    $navigator = $('#navigator');
    $navigatorTemplate = $('#title_template');
    $recommend = $('#recommend');
    $recommendTemplate = $('#recommend_template');
    $god = $('#god-reply');
    $godTemplate = $('#god_template');
    $relative = $('#relative');
    $relativeTemplate = $('#relative_template');
    navigatorModel = new NavigatorModel();
    relativeModel = new RelativeModel();
    recommendModel = new RecommendModel();
    godModel = new GodReplyModel();

    eventproxy.all('navigator', 'relative', 'recommend', 'god', function () {
        navigatorView = new NavigatorView({
            el: $navigator,
            model: navigatorModel,
            templatHtml: $navigatorTemplate.html(),
            key: 'navigator'
        });

        recommendView = new RecommendView({
            el: $recommend,
            model: recommendModel,
            templatHtml: $recommendTemplate.html(),
            key: 'recommend'
        });

        godReplyView = new GodReplyView({
            el: $god,
            model: godModel,
            templatHtml: $godTemplate.html(),
            key: 'god'
        });
        relativeView = new RelativeView({
            el: $relative,
            model: relativeModel,
            templatHtml: $relativeTemplate.html(),
            key: 'relative'
        });

        navigatorView.render();
        recommendView.render();

        if (_.keys(recommendModel.get('data').output).length > 0) {
            recommendView.render();
        } else {
            $recommend.remove();
        }

        if (_.keys(godModel.get('data').ret).length > 0) {
            godReplyView.render();
        } else {
            $god.remove();
        }

        relativeView.render();

        var $window = $(window);
        var $body = $('body');
        var isLoading = false;
        var isEnd = false;
        var tempRets = relativeModel.get('data').thread_list;

        $window.on('scroll', function () {
            var distance = $body.height() - $window.height() - $window.scrollTop();

            if (distance < 80 && !isLoading && !isEnd) {
                // loading new Data
                // TODO
                var requestData = relativeModel.get('requestData');
                requestData.page++;
                relativeModel.set('requestData', requestData);
                isLoading = true;
                $loading.show();
                $.ajax({
                    url: relativeThreadURL,
                    method: 'GET',
                    data: $.param(relativeModel.get('requestData')),
                    success: function (data) {
                        if (_.keys(data.data.thread_list).length === 0) {
                            isEnd = true;
                            $loading.hide();
                            return;
                        }
                        tempRets = _.extend(tempRets, data.data.thread_list);
                        var tmpData = relativeModel.get('data');
                        tmpData['thread_list'] = tempRets;
                        relativeModel.set(tmpData);
                        isLoading = false;
                        $loading.hide();
                    }
                });
            }
        });

        (function resetStyle() {
            var $count = $('.count');
            var $godStatement = $('.god-reply-statement');
            var $nowTime = $('.now-time');
            $count.each(function (index, ele) {
                var valueStr = $(ele).text();
                var value = parseInt(valueStr, 10);
                if (value > 10000 && value < 1000000) {
                    $(ele).text(valueStr.substring(0, valueStr.length - 4)
                        + valueStr.substring(valueStr.length - 4, valueStr.length - 3) + 'w');
                } else if (value > 1000000) {
                    $(ele).text(valueStr.substring(0, valueStr.length - 4) + 'w');
                }
            });

            $godStatement.each(function (index, ele) {
                var text = $(ele).text();
                $(ele).html(text);
            });

            $nowTime.each(function (index, ele) {
                var time = new Date(parseInt($(ele).text(), 10) * 1000);
                var delay = new Date(new Date().getTime() - time).getMinutes();
                $(ele).html(delay + '分钟前');
            });
        })();
    });

    navigatorModel.on('change', function (data) {
        eventproxy.emit('navigator', data);
    });

    relativeModel.on('change', function (data) {
        eventproxy.emit('relative', data);
    });

    recommendModel.on('change', function (data) {
        eventproxy.emit('recommend', data);
    });

    godModel.on('change', function (data) {
        eventproxy.emit('god', data);
    });

    Backbone.history.start();
})(
    window.jQuery,
    window.underscore,
    window.Backbone,
    window.Swiper,
    window.EventProxy,
    window.topicURL,
    window.relativeFormURL,
    window.relativeThreadURL,
    window.godReplyURL
);
