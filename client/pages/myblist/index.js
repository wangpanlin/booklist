const app=getApp()
const util = require('../../utils/util.js');

Page({
  data:{
    booklist:[],
    page: 1,
    size: 30,
    hasMore: false,
    loading: false
  },
  loadMore:function(){
    const that = this;
    if (!this.data.hasMore) return;
    util.request('course/listMyCourse',{ page: this.data.page++, size: this.data.size }).then(res => {
      if (res.status === 0) {
        let result = res.result;
        if (result.length){
          result = util.changeArr(result, 'id', 'course_id');
          that.setData({
            booklist: that.data.booklist.concat(result),
            loading: false
          });
        }else{
          that.setData({ hasMore: false })
        }
      }
    });
  },
  onLoad: function(){
    this.setData({ hasMore: true, loading: true })
    this.loadMore();
  },
  onReachBottom: function () {
    this.setData({
      loading: true
    })
    this.loadMore();
  },
  goToWrite: function(){
    wx.navigateTo({
      url: '../setting/index',
      url: '../editcourse/index'
    });
  }
})