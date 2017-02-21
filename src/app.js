import './app.less';

import Vue from 'vue';

import i18nTrans from './locale.js';
import merge from 'merge';

let version = '1.01-beta';
const relativeURL = `xingoxu/ps4-wallpaper-helper`;

let links = {
  win: {
    '32exe': {
      link: `https://github.com/${relativeURL}/releases/download/${version}/PS4.Wallpaper.Helper.Setup.1.0.1.x86.exe`,
    },
    '64exe': {
      link: `https://github.com/${relativeURL}/releases/download/${version}/PS4.Wallpaper.Helper.Setup.1.0.1.x64.exe`,
    },
    '647z': {
      link: `https://github.com/${relativeURL}/releases/download/${version}/PS4.Wallpaper.Helper.1.0.1.win.x64.7z`,
    },
  },
  mac: {
    'dmg': {
      link: `https://github.com/${relativeURL}/releases/download/${version}/PS4.Wallpaper.Helper-1.0.1.dmg`,
    },
  },
};

new Vue({
  el: '#app',
  data: {
    currentLang: 'eng',
    allDownload: false,
    starNumber: 0,
  },
  computed: {
    os() {
      let x64 = navigator.userAgent.indexOf('x64') >= 0;
      let x86 = !x64;
      let mac = navigator.userAgent.indexOf('Mac') >= 0;
      mac ? x86 = false : false;
      return {
        win: {
          '32': x86,
          '64': x64,
        },
        mac: mac,
      }
    },
    links() {
      return merge.recursive(true, links, i18nTrans[this.currentLang].links);
    },
    intros() {
      return this.i18n('intros');
    },
    languages() {
      return i18nTrans;
    },
    projectURL() {
      return `https://github.com/${relativeURL}`;
    },    
  },
  methods: {
    i18n(key) {
      return i18nTrans[this.currentLang][key];
    },
    getStarNumber() {
      fetchJsonp(`https://api.github.com/repos/${relativeURL}`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.starNumber = json.data.stargazers_count;
        });
    }
  },
  watch: {
    currentLang(newVal) {
      document.title = this.i18n('title');
    }
  },
  created() {
    this.getStarNumber();
    let language = navigator.browserLanguage || navigator.language;
    if (language.indexOf('cn') >= 0)
      this.currentLang = 'chs';
    if (language.indexOf('ja') >= 0)
      this.currentLang = 'jpn';
  },
  mounted() {
    document.addEventListener('scroll', event => {
      $('.intro-wrapper>.img').each((index, element) => {
        let rect = element.getBoundingClientRect(),
          top = rect.top,
          height = rect.height;
        if (top <= window.innerHeight / 2 && top >= 0)
          $(element).addClass('show');
        if (window.innerHeight - top > height / 2)
          $(element).addClass('show');          
      })
    })
  },
});
import fetchJsonp from 'fetch-jsonp';
import $ from 'jquery';