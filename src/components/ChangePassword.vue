<template >
  <b-container>
    <b-row
      ><b-col> </b-col>
      <b-col>
        <b-card class="mt-3" style="max-width: 20rem">
          <b-form @submit="handleChangePassword">
            <label for="username">Username</label>
            <b-form-input
              id="username"
              v-model="form.username"
              size="sm"
            ></b-form-input>
            <label for="password" class="mt-3">Old Password</label>

            <b-form-input
              v-model="form.oldPassword"
              type="password"
              size="sm"
            ></b-form-input>
            <label for="password" class="mt-3">New Password</label>

            <b-form-input
              v-model="form.newPassword"
              type="password"
              size="sm"
            ></b-form-input>
            <div align="center">
              <b-button class="m-3" type="submit" variant="primary"
                >Login</b-button
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
      <b-col> </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "ChangePassword",
  components: {},
  data() {
    return {
      loading: false,
      message: "",
      form: [{ username: "", oldPassword: "" , newPassword: ""}],
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
    handleChangePassword(event) {
      event.preventDefault();
      this.loading = true;

      this.$store.dispatch("auth/changePassword", this.form).then(
        () => {
          this.$router.push("/");
        },
        (error) => {
          this.loading = false;
          this.message = error.response.data.error;
        }
      );
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
</style>