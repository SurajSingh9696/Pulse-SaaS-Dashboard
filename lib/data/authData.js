// Authentication Data Configuration
export const authData = {
  branding: {
    name: "Pulse",
    subtitle: "Welcome back to your workspace",
    logo: "activity",
    year: "2024"
  },
  
  forms: {
    login: {
      title: "Log In",
      fields: [
        {
          id: "email",
          type: "email",
          label: "Email address",
          placeholder: "name@company.com",
          icon: "mail",
          required: true
        },
        {
          id: "password",
          type: "password",
          label: "Password",
          placeholder: "••••••••",
          icon: "lock",
          required: true,
          forgotPassword: true
        }
      ],
      submitButton: {
        text: "Sign in",
        action: "handleLogin"
      },
      socialAuth: {
        enabled: true,
        providers: [
          { name: "Google", icon: "google" },
          { name: "GitHub", icon: "github" }
        ]
      }
    },
    
    signup: {
      title: "Sign Up",
      fields: [
        {
          id: "fullname",
          type: "text",
          label: "Full Name",
          placeholder: "John Doe",
          icon: "user",
          required: true
        },
        {
          id: "signup-email",
          type: "email",
          label: "Email address",
          placeholder: "name@company.com",
          icon: "mail",
          required: true
        },
        {
          id: "signup-password",
          type: "password",
          label: "Password",
          placeholder: "Create a password",
          icon: "lock",
          required: true,
          helper: "Must be at least 8 characters"
        },
        {
          id: "confirm-password",
          type: "password",
          label: "Confirm Password",
          placeholder: "Confirm password",
          icon: "check-circle",
          required: true
        }
      ],
      submitButton: {
        text: "Create Account",
        action: "handleSignup"
      },
      terms: {
        text: "By signing up, you agree to our",
        links: [
          { text: "Terms of Service", url: "#" },
          { text: "Privacy Policy", url: "#" }
        ]
      }
    }
  },
  
  // Action handlers
  actions: {
    handleLogin: (formData) => {
      console.log("Login:", formData);
      // API call logic here
    },
    handleSignup: (formData) => {
      console.log("Signup:", formData);
      // API call logic here
    },
    handleSocialAuth: (provider) => {
      console.log("Social Auth:", provider);
      // OAuth logic here
    },
    handleForgotPassword: () => {
      console.log("Forgot password");
      // Reset password logic here
    }
  }
};