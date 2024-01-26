const authService = require("../services/auth.service");

module.exports = {

  // REGISTER
  async registerUser(req, res) {
    try {
      const userDetail = req.body;
      // const profileFilePath = await convertBase64.base64ToJpg(userDetail.profile_picture);
      const registrationResult = await authService.register(userDetail);
      return res.status(200).json({ message: registrationResult.message });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(401).json({ error: "Failed to create user" });
    }
  },

  // SIGN IN
  async signIn(req, res) {
    try {
      const { email, password, user_type } = req.body;
      const user = await authService.signIn(email, password, user_type);

      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(401).json({ message: "Sign in failed" });
      }
    } catch (error) {
      console.error("Error signing in:", error);
      return res.status(401).json({ error: "Failed to sign in" });
    }
  },

};