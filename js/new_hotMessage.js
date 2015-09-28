/**
 * Created by andycall on 15/9/26.
 */

/**
 *  块标题
 *
 *  @props title 标题
 * */
var TitleText = React.createClass({
   render: function () {
       return (
           <div className="title">{this.props.title}</div>
       );
   }
});

/**
 *  页面头图
 *
 *  @props imageUrl 头像地址
 *  @props imageAlt alt 属性
 */
var HeadImage = React.createClass({
    render: function () {
        return (
            <div class="img-container">
                <img src={this.props.imageUrl} alt={this.props.imageAlt || Image}/>
            </div>
        );
    }
});

/**
 *  按钮
 *
 *  @props buttonText 按钮内容
 */
var Button = React.createClass({
    render: function () {
        return (
            <button {...this.props} className="btn-default btn-large focus-button image-radius focus">{this.props.buttonText}</button>
        );
    }
});

/**
 *  吧关注按钮
 *
 *  @props fid
 *  @props uid
 *  @props buttonText 按钮内容
 *  @props itb_tbs
 *  @props isLogin 是否登陆
 *  @props isFocused 是否已关注
 *  @props loginUrl 跳转到登陆的 URL 地址
 */
var FocusButton = React.createClass({
    getInitialState: function() {
        return {isFocused: this.props.isFocused};
    },
    checkNeeds: function () {
        var needs = arguments;
        var needed = [];
        var noneNeed = [];
        var self = this;

        $.each(needs, function (val, name) {
            if (self.props[name]) {
                needed.push(name);
            } else {
                noneNeed.push(name);
            }
        });

        return noneNeed;
    },
    shouldComponentUpdate: function () {
        var isFocused = parseInt(this.props.isFocused) || 0;
        var isLogin = this.props.isLogin;

        if (typeof isLogin === 'string'
            && (isLogin !== 'false' || isLogin !== 'true')
        ) {

        }

        var self = this;

        if (isFocused) {
            return false;
        }

        if (!isLogin) {
            var needs = this.checkNeeds('loginUrl');
            if (needs.length === 0) {
                location.href = this.props.loginUrl;
            } else {
                throw new Error('Error: Components: FocusButton; Msg: need LoginUrl param');
            }
        }

        var uname = ['kw', 'fid', 'uid', 'itb_tbs'];
        var data = {};

        $.each(uname, function (index, name) {
            data[name] = self.props[name];
        });

        $.ajax({
            url: '/favolike',
            data: data,
            method: 'GET',
            success: function (data) {
                if (data.no === 0) {
                    self.setState({
                        isFocused: true
                    });
                } else {
                    throw new Error('Error: Components FocusButton \n msg: Server response error, please check your params');
                }
            },
            error: function () {

            }
        });
    },
    onButtonClick: function (e) {
        e.preventDefault();
        this.setState({isFocused: true});
    },
    render: function () {
        var isFocused = parseInt(this.state.isFocused);

        if (isFocused) {
            return (
                <p className="focused">已关注</p>
            );
        } else {
            return (
                <Button {...this.props} onClick={this.onButtonClick} isLogin={this.props.isLogin} isFocused={this.props.isFocused} fid={this.props.fid} kw={this.props.kw} uid={this.props.uid} itb_tbs={this.props.itb_tbs} buttonText={this.props.buttonText}></Button>
            );
        }
    }
});

/**
 * 批量处理按钮
 *
 *
 */
var FocusButtonGroup = React.createClass({
    getInitialState: function () {
        return JSON.parse(this.props.data);
    },
    multiFocus: function (e) {
        var state = this.state.item.map(function (item, i) {
            item.isFocused = true;
            return item;
        });

        this.setState({
            item: state
        });
    },
    render: function () {
        var buttonGroups = this.state.item.map(function (item, i) {
            return (
                <FocusButton isLogin={item.isLogin} isFocused={item.isFocused} fid={item.fid} kw={item.kw} uid={item.uid} itb_tbs={item.itb_tbs} buttonText={item.buttonText}></FocusButton>
            );
        });

        return (
            <div className="button-group">
                {buttonGroups}
                <Button {...this.props} onClick={this.multiFocus} buttonText="批量关注"></Button>
            </div>
        );
    }
});