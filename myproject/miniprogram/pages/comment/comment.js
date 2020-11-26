// miniprogram/pages/comment/comment.js
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:[],
    content:"",
    score:"",
    images:[],
    fileIDs:[],
    movieId:0
  },
  onContentChange:function(event){
    this.setData({
      content:event.detail
    });
  },
  onScore:function(event){
    this.setData({
      score:event.detail
    });
  },
  submit:function(){
    wx.showLoading({
      title: '提交中',
    })
    console.log(this.data.score);

    let promiseArr=[];
    for(let i=0;i<this.data.images;i++){
      promiseArr.push(new Promise((reslove,reject)=>{
        let temp=this.data.images[i];
        let suff=/\.\w+$/.exec(temp)[0];
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime()+suff,
          filePath: temp,
          success: res => {
            console.log('上传成功', res.fileID);
            this.setData({
              fileIDs:this.data.fileIDs.concat(res.fileID)
            });
            reslove();
          },
        })
      }));
    }
    Promise.all(promiseArr).then(res=>{
      db.collection("comment").add({
        data:{
          content:this.data.content,
          score:this.data.score,
          movieId:this.data.movieId,
          fileIDs:this.data.fileIDs
        }
      }).then(res=>{
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
        })
      }).catch(res=>{
        wx.hideLoading();
        wx.showToast({
          title: '评价失败',
        })
      });
    });

  },
  upImg:function(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        this.setData({
          images:this.data.images.concat(tempFilePaths)
        });
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieId:options.mid
    });
    console.log(options);
    wx.cloud.callFunction({
      name:"getDetail",
      data:{
        mid:options.mid
      }
    }).then(res=>{

      this.setData({
        detail:this.data.detail.concat(JSON.parse(res.result)) 
      });
      console.log(res);
    }).catch(err=>{
      console.log(err);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})