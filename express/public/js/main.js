(() => {
  if (window.require) {
    var fs = require('fs');
  }

  new Vue({
    el: '#app',
    data: {
      isDragging: false,
      loading: false,

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
          return value += `:${port}`;
        })
        return ips;
      })()
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
          message: 'You have chosen more than one file, only first file will be selected.',
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
            message: 'You may chosen wrong file. Check it?',
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
              title: 'Success!',
              message: `Open your PS4 Browser at ${this.ips.join(' or ')}`,
              type: 'success',
              duration: 0,
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
    }
  })
})()