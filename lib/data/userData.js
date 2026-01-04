// User Dashboard Data Configuration
export const userData = {
  branding: {
    name: "Pulse",
    subtitle: "User Portal",
    logo: "activity"
  },
  
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    initials: "JD",
    plan: "Pro Plan",
    company: "Acme Corporation",
    avatar: null // URL if available
  },
  
  navigation: [
    { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
    { id: "orders", label: "Orders / Usage", icon: "shopping-cart" },
    { id: "analytics", label: "Analytics", icon: "bar-chart-3" },
    { id: "billing", label: "Billing", icon: "credit-card" },
    { id: "settings", label: "Settings", icon: "settings" }
  ],
  
  dashboard: {
    greeting: "Welcome back, John!",
    stats: [
      {
        id: "total-orders",
        title: "Total Orders",
        value: "247",
        change: "+12%",
        changeType: "positive",
        icon: "shopping-bag",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600"
      },
      {
        id: "amount-spent",
        title: "Amount Spent",
        value: "$12,458",
        change: "+8%",
        changeType: "positive",
        icon: "dollar-sign",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600"
      },
      {
        id: "monthly-orders",
        title: "Orders This Month",
        value: "18",
        change: "This Month",
        changeType: "neutral",
        icon: "calendar",
        iconBg: "bg-green-100",
        iconColor: "text-green-600"
      }
    ],
    chart: {
      title: "Monthly Spending Trend",
      type: "line",
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Monthly Spending',
          data: [850, 920, 1100, 980, 1250, 1180, 1350, 1420, 1280, 1380, 1450, 1520],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      }
    }
  },
  
  orders: {
    title: "Recent Orders",
    columns: ["Order ID", "Date", "Amount", "Status"],
    data: [
      { id: "#ORD-2847", date: "Dec 15, 2024", amount: "$249.00", status: "Completed", statusColor: "green" },
      { id: "#ORD-2846", date: "Dec 12, 2024", amount: "$89.00", status: "Completed", statusColor: "green" },
      { id: "#ORD-2845", date: "Dec 10, 2024", amount: "$159.00", status: "Processing", statusColor: "blue" },
      { id: "#ORD-2844", date: "Dec 8, 2024", amount: "$329.00", status: "Completed", statusColor: "green" },
      { id: "#ORD-2843", date: "Dec 5, 2024", amount: "$199.00", status: "Completed", statusColor: "green" },
      { id: "#ORD-2842", date: "Dec 3, 2024", amount: "$449.00", status: "Completed", statusColor: "green" },
      { id: "#ORD-2841", date: "Nov 30, 2024", amount: "$129.00", status: "Pending", statusColor: "yellow" },
      { id: "#ORD-2840", date: "Nov 28, 2024", amount: "$279.00", status: "Completed", statusColor: "green" }
    ]
  },
  
  analytics: {
    usageChart: {
      title: "Monthly Usage",
      type: "bar",
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Usage Hours',
          data: [45, 52, 48, 58],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }]
      }
    },
    comparisonChart: {
      title: "Current vs Previous Month",
      type: "bar",
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Current Month',
            data: [45, 52, 48, 58],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          },
          {
            label: 'Previous Month',
            data: [38, 42, 45, 50],
            backgroundColor: 'rgba(156, 163, 175, 0.5)',
            borderColor: 'rgb(156, 163, 175)',
            borderWidth: 1
          }
        ]
      }
    }
  },
  
  billing: {
    currentPlan: {
      title: "Current Plan",
      badge: "Pro",
      details: [
        { label: "Plan Type", value: "Pro Plan" },
        { label: "Monthly Spend", value: "$49.00" },
        { label: "Next Billing Date", value: "Jan 15, 2025" },
        { label: "Payment Method", value: "•••• 4242" }
      ],
      upgradeButton: {
        text: "Upgrade to Enterprise",
        action: "handleUpgrade"
      }
    },
    history: [
      { month: "December 2024", date: "Paid on Dec 15, 2024", amount: "$49.00" },
      { month: "November 2024", date: "Paid on Nov 15, 2024", amount: "$49.00" },
      { month: "October 2024", date: "Paid on Oct 15, 2024", amount: "$49.00" },
      { month: "September 2024", date: "Paid on Sep 15, 2024", amount: "$49.00" }
    ]
  },
  
  settings: {
    profile: {
      title: "Profile Information",
      fields: [
        { id: "fullname", label: "Full Name", type: "text", value: "John Doe" },
        { id: "email", label: "Email Address", type: "email", value: "john.doe@example.com" },
        { id: "company", label: "Company", type: "text", value: "Acme Corporation" }
      ],
      saveButton: { text: "Save Changes", action: "handleSaveProfile" }
    },
    password: {
      title: "Change Password",
      fields: [
        { id: "current-password", label: "Current Password", type: "password", placeholder: "Enter current password" },
        { id: "new-password", label: "New Password", type: "password", placeholder: "Enter new password" },
        { id: "confirm-new-password", label: "Confirm New Password", type: "password", placeholder: "Confirm new password" }
      ],
      saveButton: { text: "Update Password", action: "handleUpdatePassword" }
    },
    notifications: {
      title: "Notification Preferences",
      options: [
        { id: "email-notif", label: "Email Notifications", description: "Receive email updates about your account", checked: true },
        { id: "order-updates", label: "Order Updates", description: "Get notified when your order status changes", checked: true },
        { id: "billing-alerts", label: "Billing Alerts", description: "Receive alerts about billing and payments", checked: true },
        { id: "marketing", label: "Marketing Emails", description: "Receive promotional offers and updates", checked: false }
      ]
    }
  },
  
  // Action handlers
  actions: {
    handleUpgrade: () => console.log("Upgrade plan"),
    handleDownloadInvoice: (month) => console.log("Download invoice:", month),
    handleSaveProfile: (data) => console.log("Save profile:", data),
    handleUpdatePassword: (data) => console.log("Update password:", data),
    handleNotificationToggle: (id, checked) => console.log("Toggle notification:", id, checked)
  }
};