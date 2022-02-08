<template>
  <b-container>
    <b-row >
      <b-col></b-col>
      <b-col>
        <b-card class="mt-3" style="max-width: 20rem">
          <b-form @submit="handleRegister">
            <label for="username">Username</label>
            <b-form-input
              id="username"
              v-model="form.username"
              size="sm"
            ></b-form-input>
            <label for="email" class="mt-3">Email</label>
            <b-form-input
              id="email"
              v-model="form.email"
              size="sm"
            ></b-form-input>
            <label for="password" class="mt-3">Password</label>
            <b-form-input
              id="password"
              v-model="form.password"
              type="password"
              size="sm"
            ></b-form-input>
            <div align="center">
              <b-button class="m-3" type="submit" variant="primary"
                >Register</b-button
              >
            </div>
          </b-form>

          <div class="form-group">
            <div v-if="message" class="alert alert-danger" role="alert">
              {{ message }}
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Register",
  components: {},
  data() {
    return {
      successful: false,
      loading: false,
      message: "",
      form: [{ username: "", email: "", password: "" }],
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/login");
    }
  },
  methods: {
    handleRegister(event) {
      event.preventDefault();
      this.message = "";
      this.successful = false;
      this.loading = true;

      this.$store.dispatch("auth/register", this.form).then(
        (data) => {
          this.message = data.message;
          this.successful = true;
          this.loading = false;
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.successful = false;
          this.loading = false;
        }
      );
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
</style>