import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);
// https://vuetifyjs.com/zh-Hans/customization/internationalization/
// Translation provided by Vuetify (javascript)
import zhHans from 'vuetify/es5/locale/zh-Hans'

export default new Vuetify({
  lang: {
    locales: { zhHans },
    current: 'zhHans',
  },
});
