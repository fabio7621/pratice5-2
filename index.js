const userModal = {
  data() {
    return {
      productModal: null,
      qty: 1,
    };
  },
  props: ["tempProduct", "addToCart"],
  template: "#userProductModal",
  methods: {
    open() {
      this.productModal.show();
    },
    close() {
      this.productModal.hide();
    },
  },
  watch: {
    tempProduct() {
      this.qty = 1;
    },
  },
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.modal);
  },
};

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  generateMessage: localize("zh_TW"),
});

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "fabio20";

const app = Vue.createApp({
  data() {
    return {
      products: [],
      cart: {},
      tempProduct: {},
      //狀態管理
      isLoading: true,
      status: {
        addCartLoading: "",
        cartQtyLoading: "",
      },
      carts: {},
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  components: {
    userModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    getProducts() {
      const url = `${apiUrl}/api/${apiPath}/products`;
      axios
        .get(url)
        .then((response) => {
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 查看更多
    openModal(product) {
      this.tempProduct = { ...product };
      this.$refs.pModal.open();
    },
    addToCart(product_id, qty = 1) {
      //參數預設子
      const url = `${apiUrl}/api/${apiPath}/cart`;
      const orderCart = {
        product_id: product_id,
        qty,
      };
      //loading
      this.status.addCartLoading = product_id;
      axios
        .post(url, { data: orderCart })
        .then((response) => {
          this.status.addCartLoading = "";
          this.$refs.pModal.close();
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getCart() {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios
        .get(url)
        .then((res) => {
          this.carts = res.data.data;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    updateCart(item, qty = 1) {
      const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      const orderCart = {
        product_id: item.product_id,
        qty,
      };
      this.status.cartQtyLoading = item.id;
      //loading
      axios
        .put(url, { data: orderCart })
        .then((res) => {
          this.status.cartQtyLoading = "";
          this.getCart();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    delCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.status.cartQtyLoading = id;
      axios
        .delete(url)
        .then((res) => {
          this.status.cartQtyLoading = "";
          this.getCart();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    delCartAll() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios
        .delete(url)
        .then((res) => {
          this.getCart();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    seedOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios
        .post(url, { data: order })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          alert("成功送出");
          this.getCart();
        })
        .catch((err) => {
          alert("送出失敗");
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  },
});
app.component("loading", VueLoading.Component);
app.mount("#app");
