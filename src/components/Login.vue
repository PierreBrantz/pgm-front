<template >
  <b-container>
    <b-row
      ><b-col> </b-col>
      <b-col>
        <b-card class="mt-3" style="max-width: 20rem">
          <b-form @submit="handleLogin">
            <label for="username">Username</label>
            <b-form-input
              id="username"
              v-model="form.username"
              size="sm"
            ></b-form-input>
            <label for="password" class="mt-3">Password</label>

            <b-form-input
              v-model="form.password"
              type="password"
              size="sm"
            ></b-form-input>
            <div align="center">
              <b-button class="m-3" type="submit" variant="primary"
                >Login</b-button
              >
            </div>
          </b-form>
         <b-link to="/changePassword">Mot de passe oublié?</b-link>
          <div class="form-group">
            <div v-if="message" class="alert alert-danger" role="alert">
              {{ message }}
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col> </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {
      loading: false,
      message: "",
      form: [{ username: "", password: "" }],
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  },
  methods: {
    handleLogin(event) {
      event.preventDefault();
      this.loading = true;

      this.$store.dispatch("auth/login", this.form).then(
        () => {
          this.$router.push("/");
        },
        (error) => {
          this.loading = false;
          this.message = error.response.data.error;
        }
      );
    },
  },
};
</script>

<style scoped>
</style>