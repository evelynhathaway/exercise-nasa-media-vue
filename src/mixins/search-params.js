export default {
  data() {
    return {
      defaults: {
        query: "",
        mediaTypes: ["image", "video", "audio"],
        page: 1,
      },
    }
  },
  computed: {
    query() {
      const {query} = this.$route.params;
      if (query) {
        return query.replace(/-(?!-)/g, " ");
      }
      return this.defaults.query;
    },
    mediaTypes() {
      const {mediaTypes} = this.$route.params;
      if (mediaTypes) {
        return mediaTypes.toLowerCase().split("-");
      }
      return this.defaults.mediaTypes;
    },
    page() {
      const {page} = this.$route.params;
      if (page) {
        return parseInt(page);
      }
      return this.defaults.page;
    },
  },
  methods: {
    linkGen(newSearchParams) {
      // Update search params for use in generation
      const {query, mediaTypes, page} = {
        query: this.query,
        mediaTypes: this.mediaTypes,
        page: this.page,
        ...newSearchParams,
      };

      let url = "";
      if (query) {
        url += `/search/${query.replace(/-/g, "--").replace(/ /g, "-")}`;
      }
      if (mediaTypes.length < 3) {
        url += `/${mediaTypes.join("-")}`;
      }
      if (page > 1) {
        url += `/${page}`;
      }
      return url;
    },
  },
};
