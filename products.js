import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'vuejs',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  methods:{
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios.get(url).then((response) => {
        this.products = response.data.products;
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    updateProduct() {
      // 新增 API
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';

      // 修改 API
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](url, { data: this.tempProduct })
      .then((response) => {
        alert(response.data.message);
        productModal.hide();
        // 重新取得資料
        this.getData();
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    openModal(isNew, item) {
      if (isNew === 'new') { // 新資料
        // temp 清空
        this.tempProduct = {
          imagesUrl: [],
        };
        // 開啟 productModal
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') { // 編輯
        // 將要編輯的那項資料淺層拷貝給 temp
        this.tempProduct = { ...item };
        // 開啟 productModal
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') { // 刪除
        // 將要刪除的那項資料淺層拷貝給 temp
        this.tempProduct = { ...item };
        // 開啟 delProductModal
        delProductModal.show()
      }
    },
    delProduct() {
      // 刪除 API
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        // 重新取得資料
        this.getData();
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    createImages() {
      // imagesUrl 設定為陣列，並且push初始值
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
  mounted() {
    // 初始化 productModal
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });
    // 初始化 delProductModal
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    // 取出 Token，並且自動加到 hearders
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexVueToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    // 確認登入，並且將資料透過api存到products
    this.checkAdmin();
  }
}).mount('#app');