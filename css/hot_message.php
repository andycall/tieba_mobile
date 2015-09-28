<?= HTML::css('dep/swiper.css', 'syunying') ?>
<?php
    $uid = $this->getPageData('uid');
?>
<div id="loading" class="loading hide"></div>
<section class="hot-message">

    <section class="navigator-wrapper" id="navigator"></section>

    <section class="recommend" id="recommend">

    </section>

    <section class="god-reply" id="god-reply">

    </section>

    <section class="relative" id="relative">

    </section>

    <section class="end all">暂无更多</section>
</section>
<script type="text/template" id="title_template">
    <section class="img-container">
        <img src="<%= navigator.ret[0].extra.head_pic %>" alt="Image">
    </section>
    <section class="navigator">
        <div class="title-head">
            <h3 class="title">#<%= navigator.ret[0].topic_name %>#</h3>
            <h5 class="discuss"><%= navigator.ret[0].commentCount %> 讨论</h5>
        </div>
        <p class="title-content"><%= navigator.ret[0].topic_desc %></p>
    </section>
</script>

<script type="text/template" id="recommend_template">
    <section class="recommend-head clearfix">
        <h4 class="recommend-title">#<%= recommend.data.relate_forum_title %>#相关吧推荐</h4>
        <!-- 滑动按钮 -->
        <% if (_.keys(recommend.data.output).length > 4){ %>
        <div class="recommend-see-all all"><a href="<?= 'http://tieba.baidu.com/mo/q/hotMessageMore?topic_id='. _GET('topic_id')?>">查看全部</a></div>
        <% } else { %>
        <div class="swiper-pagination recommend-pagination"></div>
        <% } %>
    </section>
    <div class='recommend-content swiper-container slider-container'>
        <ul class="swiper-wrapper clearfix">
            <% if (_.keys(recommend.data.output).length <= 4 ){ %>
                <% _.each(recommend.data.output, function (value, name) { %>
                    <li class="swiper-slide clearfix">
                        <a class="media-left" href="http://tieba.baidu.com/f?kw=<%= value.forum_name.forum_name %>&ie=utf-8">
                            <img class="image-radius" src="<%= value.card.avatar %>" alt="image" />
                        </a>
                        <div class="media-content">
                            <p class="media-title title"><a href="http://tieba.baidu.com/f?kw=<%= value.forum_name.forum_name %>&ie=utf-8"><%= value.forum_name.forum_name %></a></p>
                            <div class="content-group">
                                <span class="recommend-title">关注</span>
                                <span class="count recommend-title"><%= value.statistics.member_count %></span>
                                <span class="recommend-title">帖子</span>
                                <span class="count recommend-title"><%= value.statistics.post_num %></span>
                            </div>
                            <div class="content-group">
                                <span class="recommend-title"><%= value.card.slogan %></span>
                            </div>
                        </div>
                        <div class="media-right">
                            <% if (value.hasFocused == 1) { %>
                            <button data-kw="<%= value.forum_name.forum_name %>" data-fid="<%= name %>" class="btn-default btn-large focus-button image-radius focus" data-id="<%= value.id %>">关注</button>
                            <% } else { %>
                            <p class="all">已关注</p>
                            <% } %>
                        </div>
                    </li>
                <% }); %>
            <% } else { %>
                <li class="swiper-slide media-horizontal clearfix">
                    <div class="media-left">
                        <a href="http://tieba.baidu.com/f?kw=<%= recommend.data.output[_.keys(recommend.data.output)[0]].forum_name.forum_name %>&ie=utf-8"><img class="image-radius" src="<%= recommend.data.output[_.keys(recommend.data.output)[0]].card.avatar %>" alt="image" /></a>
                    </div>
                    <div class="media-content">
                        <p class="media-title title"><a href="http://tieba.baidu.com/f?kw=<%= recommend.data.output[_.keys(recommend.data.output)[0]].forum_name.forum_name %>&ie=utf-8"><%= recommend.data.output[_.keys(recommend.data.output)[0]].forum_name.forum_name %></a></p>
                        <div class="content-group">
                            <span class="recommend-title">关注</span>
                            <span class="count recommend-title"><%=  recommend.data.output[_.keys(recommend.data.output)[0]].statistics.member_count %></span>
                            <span class="recommend-title">帖子</span>
                            <span class="count recommend-title"><%=  recommend.data.output[_.keys(recommend.data.output)[0]].statistics.post_num %></span>
                        </div>
                        <div class="content-group">
                            <span class="recommend-title"><%=  recommend.data.output[_.keys(recommend.data.output)[0]].card.slogan %></span>
                        </div>
                    </div>
                    <div class="media-right">
                        <% if (!recommend.data.output[_.keys(recommend.data.output)[0]].hasFocused) { %>
                        <button data-kw="<%= recommend.data.output[_.keys(recommend.data.output)[0]].forum_name.forum_name %>"   data-fid="<%= _.keys(recommend.data.output)[0] %>" class="btn-default btn-large focus-button image-radius focus" data-id="<%= recommend.data.output[_.keys(recommend.data.output)[0]].id %>">关注</button>
                        <% } else { %>
                        <p class="all">已关注</p>
                        <% } %>
                    </div>
                </li>
            <% } %>
        </ul>
    </div>
</script>

<script type="text/template" id="god_template">
    <section class="god-reply-head">
        <h4 class="recommend-title">#<%= god.magic_title %>#神回复</h4>
    </section>
    <% _.each(god.ret, function(val, godid){ %>
            <section class="god-reply-content">
                <div class="flex-content">
                    <a class="media-left">
                        <img class="image-radius" src="<%= val.avatarURL %>" alt="image" />
                    </a>
                    <div class="media-content">
                        <p class="god-title"><a href="http://tieba.baidu.com/home/main?un=<%= val.username %>&ie=utf-8&fr=pb"><%= val.username %></a></p>
                        <span class="god-statement now-time"><%= val.now_time %></span>
                    </div>
                   <div class="media-right">
                       <a class="to-block" href="http://tieba.baidu.com/p/<%= val.thread_id %>?kz=<%= val.thread_id %>&from_search=1&sz=<%= godid %>&lp=home_main_thread_pb&mo_device=1">
                        <span class="comment">评论</span>
                        <span class="icon-message">Icon</span>
                       </a>
                    </div>
                </div>
                <a class="block" href="http://tieba.baidu.com/p/<%= val.thread_id %>?kz=<%= val.thread_id %>&from_search=1&sz=<%= godid %>&lp=home_main_thread_pb&mo_device=1"><div class="title god-reply-statement clearfix">
                    <%= val.content %>
                </div></a>
            </section>
    <% }); %>
<!--    <section class="look-for-more">-->
<!--        <p class="more">查看更多</p>-->
<!--    </section>-->
</script>

<script type="text/template" id="relative_template">
    <% _.each(relative.thread_list, function (val, index) { %>
    <section class="relative-wrapper">
        <% if (index === _.keys(relative.thread_list)[0]) { %>
        <section class="relative-head">
            <h4 class="recommend-title">相关帖推荐</h4>
        </section>
        <% } %>
        <section class="relative-content">
            <div class="flex-content">
                <div class="media-left">
                    <a href="http://tieba.baidu.com/home/main?un=<%= val.avatarURL %>&ie=utf-8&fr=pb"><img class="image-radius" src="<%= val.avatarURL %>" alt="image" /></a>
                </div>
                <div class="media-content">
                    <p class="god-title"><a href="http://tieba.baidu.com/home/main?un=<%= val.avatarURL %>&ie=utf-8&fr=pb"><%= val.user_name %></a></p>
                    <span class="god-statement now-time"><%= val.create_time %></span>
                </div>
                <div class="media-right">
                    <span class="comment no-margin"><%= val.post_num %></span>
                    <span class="icon-message">Icon</span>
                    <span class="comment"><%= val.zan.num || 0 %></span>
                    <span class="icon-praise" data-id="<%= val.id %>">Praise</span>
                </div>
            </div>
            <div class="title relative-statement">
                <a class="block" href="http://tieba.baidu.com/p/<%= val.thread_id %>">
                <h2 class="big-title"><%= val.title %></h2>
                <p class="god-reply-content"><%= val.abstract %></p></a>
            </div>
        </section>
    </section>
    <% }); %>
</script>
<script>
    var topicURL = location.protocol + '//' + location.host + "/mo/q/hotMessage/content";
    var relativeFormURL = location.protocol + '//' + location.host  + "/mo/q/hotMessage/relativeForm";
    var relativeThreadURL = location.protocol + '//' + location.host + "/mo/q/hotMessage/relativeThread";
    var godReplyURL = location.protocol + '//' + location.host + "/mo/q/hotMessage/god";
    var loginUrl = $.unescapeHTML(decodeURIComponent("<? echo _j($__helper__->url->wap("login", $selfUrl)) ?>"));
    var refer = "<? echo _j($_SERVER["HTTP_REFERER"]) ?>";
</script>
<?php
    echo HTML::combojs(array(
        'syunying/dep/eventproxy.js',
    ));
?>

<?php
    echo HTML::combojs(array(
        'syunying/dep/jquery.js',
        'syunying/dep/underscore.js',
        'syunying/dep/backbone.js',
        'syunying/dep/swiper.js',
    ));
?>
<script>
    jQuery.noConflict();
</script>