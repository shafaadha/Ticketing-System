const authService = require("./authService");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, role } = await authService.login(email, password);
    res.json({ message: "Login successful", token, role });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = { login };
