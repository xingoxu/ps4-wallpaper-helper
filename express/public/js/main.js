(() => {
  if (window.require) {
    var fs = require('fs');
  }
  let i18Trans = {
    'eng': {
      name: 'En',
      title: 'PS4 Wallpaper Helper',
      intros: [{
        text: 'Drop the image',
      }, {
        text: 'Open the browser in PS4 under the instruction',
        warning: `Don't forget to input the http:// and the port!`,
      }, {
        text: 'Press □ to fullscreen, take a screenshot and set it your wallpaper'
      }],
      githubTooltip: `Say thanks by star me<br/>It tooks just 5s!`,
      'intro-previous': 'Previous',
      'intro-next': 'Next',
      'intro-complete': 'I got it!',
      'currentImage': 'Current Image',
      'dropZone': 'Drag & Drop Image here',
      'or': 'or',
      'moreThanOneFileSelected': 'You have chosen more than one file, only first file will be selected.',
      'successUploaded': 'Open your PS4 Browser with one of the following urls: ',
      'selectWrongFile': 'You might choose wrong file. Check it?',
      success: 'Success',
    },
    'chs': {
      name: '中文',
      title: 'PS4壁纸小助手',
      intros: [{
        text: '拖进壁纸',
      }, {
        text: '根据提示打开PS4网络浏览器',
        warning: `不要忘记输入 http:// 和端口号！`,
      }, {
        text: '按 □ 全屏, 按下分享键截图并设置壁纸'
      }],
      githubTooltip: `如果喜欢，请帮我点亮星星<br/>仅需5秒！`,
      'intro-previous': '上一页',
      'intro-next': '下一页',
      'intro-complete': '好的',
      'currentImage': '当前壁纸',
      'dropZone': '拖拽图片到这里',
      'or': '或',
      'moreThanOneFileSelected': '选择了多个文件，仅第一个文件会被使用。',
      'successUploaded': '打开PS4网络浏览器，输入以下网址的其中一个：',
      'selectWrongFile': '你好像选择的不是图片文件，请再检查一下',
      success: '成功',      
    },
    'jpn': {
      name: '日本語',
      title: 'プレイステーション4 ウォールペーパー ツール',
      intros: [{
        text: 'イメージをドロップする',
      }, {
        text: '指示に従ってブラウザを開く',
        warning: `http:// とポート番号を入力することを忘れないでください！`,
      }, {
        text: '□ ボタンを押して全画面表示する, スクリーンショットを取って壁紙を設定する'
      }],
      githubTooltip: `好きでしょう？スターをつけてください<br/>ただ５秒！`,
      'intro-previous': '前へ',
      'intro-next': '次へ',
      'intro-complete': 'わかった！',
      'currentImage': '現在の画像',
      'dropZone': 'イメージをここでドロップしてください',
      'or': 'か',
      'moreThanOneFileSelected': '複数のファイルを選択した、最初のファイルのみが使用されます',
      'successUploaded': 'PS4のウェブブラウザを開いて，下のURLのいずれかを入力してください：',      
      'selectWrongFile': '間違ったファイルが選択されました、チェックしてください',
      success: '成功した',      
    }
  }

  new Vue({
    el: '#app',
    data: {
      isDragging: false,
      loading: false,
      currentLang: 'eng',

      introShowing: false,
      introStep: 0,

      githubTooltip: false,

      ips: (() => {
        if (!window.require)
          return [];
        let os = require('os'),
          ips = [],
          ifaces = os.networkInterfaces();
        for (let dev in ifaces) {
          ifaces[dev].forEach(function (details, alias) {
            if (details.family == 'IPv4' && details.address != '127.0.0.1') {
              ips.push(details.address);
            }
          });
        }
        let port = require('electron').remote.getGlobal('server').port;
        ips = ips.map((value) => {
          return value = `http://${value}:${port}`;
        })
        return ips;
      })()
    },
    mounted() {
      if (this.isFirstTime) 
        this.introShowing = true;
      document.title = this.i18n('title');
      this.currentLang = localStorage['language'] || 'eng';
    },
    computed: {
      intros() {
        return this.i18n('intros');
      },
      isFirstTime() {
        return (!localStorage['first']) || localStorage['first'] != 'false';
      },
      languages() {
        return i18Trans;
      }
    },
    methods: {
      checkFileType(files) {
        if (files.length <= 0)
          return false;
        let acceptExtension = ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'tiff'];
        let fileNameArray = files[0].name.split('.');
        let ext = fileNameArray[fileNameArray.length - 1];
        return acceptExtension.indexOf(ext) >= 0;
      },
      showFileMoreThanOne() {
        this.$notify({
          title: 'Warning',
          message: this.i18n('moreThanOneFileSelected'),
          type: 'warning',
          duration: 5000,
        });
      },
      handleFileSelect(event) {
        this.isDragging = false;

        let files = event.dataTransfer.files; // FileList object.
        if (files.length > 1)
          this.showFileMoreThanOne();
        if (!this.checkFileType(files))
          return this.$message({
            message: this.i18n('selectWrongFile'),
            type: 'error',
            duration: 5000,
          });
        let file = files[0];

        this.loading = true;
        this.$http.post('/img', {
          path: file.path,
        })
          .then(response => {
            this.$notify({
              title: `${this.i18n('success')}!`,
              message: `${this.i18n('successUploaded')} ${this.ips.join(' '+ this.i18n('or') +' ')}`,
              type: 'success',
              duration: 0,
              offset: 80,
              onClose: () => {
                this.githubTooltip = true;            
              }
            });
            fs.readFile(file.path, (err, buffer) => {
              if (err) return;
              let blob = new window.Blob([new Uint8Array(buffer)]);
              this.$refs.currentImage.src = window.URL.createObjectURL(blob);
            });
          })
          .catch(response => {
            this.$message({
              message: response.body ? response.body.message : 'Network Error',
              type: 'error',
              duration: 5000,
            });
          })
          .then(() => {
            this.loading = false;
          });
      },

      closeIntro() {
        this.introShowing = false;
        this.introStep = 0;
        localStorage['first'] = 'false';
      },

      changeLang(lang) {
        this.currentLang = lang;
        localStorage['language'] = lang;
      },

      external(link) {
        return require('electron').shell.openExternal(link);
      },
      i18n(key) {
        return i18Trans[this.currentLang][key];
      }
    },
    watch: {
      'introShowing'(newVal) {
        if (newVal)
          setTimeout(() => { document.getElementById('intro').focus(); }, 0);
      },
      currentLang(newVal) {
        document.title = this.i18n('title');        
      }
    }
  });




})()