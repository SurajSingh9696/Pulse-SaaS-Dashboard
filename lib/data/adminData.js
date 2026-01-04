// Admin Dashboard Data Configuration
export const adminData = {
  branding: {
    name: "Pulse",
    subtitle: "Admin",
    logo: "layers"
  },
  
  admin: {
    name: "Suraj Singh",
    email: "alex@pulse.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  
  navigation: {
    main: [
      { id: "overview", label: "Overview", icon: "layout-dashboard" },
      { id: "users", label: "Users", icon: "users" },
      { id: "orders", label: "Orders", icon: "shopping-cart" },
      { id: "analytics", label: "Analytics", icon: "bar-chart-2" }
    ],
    system: [
      { id: "settings", label: "Settings", icon: "settings" }
    ]
  },
  
  overview: {
    stats: [
      {
        id: "total-users",
        title: "Total Users",
        value: "24,532",
        change: "+12.5%",
        changeType: "positive",
        icon: "users",
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600"
      },
      {
        id: "total-revenue",
        title: "Total Revenue",
        value: "$142,384",
        change: "+8.2%",
        changeType: "positive",
        icon: "dollar-sign",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600"
      },
      {
        id: "total-orders",
        title: "Total Orders",
        value: "1,482",
        change: "-2.4%",
        changeType: "negative",
        icon: "shopping-bag",
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600"
      },
      {
        id: "monthly-growth",
        title: "Monthly Growth",
        value: "18.2%",
        change: "+4.6%",
        changeType: "positive",
        icon: "trending-up",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600"
      }
    ],
    
    revenueChart: {
      title: "Revenue Overview",
      type: "line",
      timeframes: ["Last 12 Months", "Last 30 Days", "Last 7 Days"],
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue',
          data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 45000, 42000, 55000, 60000],
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.4,
          fill: true
        }]
      }
    },
    
    demographicsChart: {
      title: "User Demographics",
      type: "doughnut",
      data: {
        labels: ['Enterprise', 'Pro Plan', 'Free Tier'],
        datasets: [{
          data: [45, 35, 20],
          backgroundColor: ['#6366f1', '#60a5fa', '#cbd5e1'],
          borderWidth: 0
        }]
      },
      legend: [
        { label: "Enterprise", percentage: "45%", color: "bg-indigo-500" },
        { label: "Pro Plan", percentage: "35%", color: "bg-blue-400" },
        { label: "Free Tier", percentage: "20%", color: "bg-slate-300" }
      ]
    }
  },
  
  users: {
    title: "User Management",
    searchPlaceholder: "Search users...",
    columns: ["User Name", "Email", "Join Date", "Status", "Actions"],
    data: [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        joinDate: "Oct 24, 2023",
        status: "Active",
        statusColor: "emerald"
      },
      {
        id: 2,
        name: "Michael Chen",
        email: "m.chen@tech.co",
        joinDate: "Oct 22, 2023",
        status: "Active",
        statusColor: "emerald"
      },
      {
        id: 3,
        name: "Jessica Williams",
        email: "jess.w@design.io",
        joinDate: "Sep 15, 2023",
        status: "Inactive",
        statusColor: "slate"
      },
      {
        id: 4,
        name: "David Miller",
        email: "dave@startup.net",
        joinDate: "Aug 02, 2023",
        status: "Blocked",
        statusColor: "rose"
      }
    ],
    pagination: {
      current: 1,
      total: 2453,
      perPage: 4
    },
    actions: {
      addUser: () => console.log("Add user"),
      editUser: (userId) => console.log("Edit user:", userId),
      blockUser: (userId) => console.log("Block user:", userId),
      unblockUser: (userId) => console.log("Unblock user:", userId)
    }
  },
  
  orders: {
    title: "Recent Transactions",
    columns: ["Order ID", "User Name", "Amount", "Date", "Status", "Invoice"],
    data: [
      {
        id: "#ORD-7352",
        userName: "Sarah Johnson",
        amount: "$299.00",
        date: "Oct 24, 2023",
        status: "Completed",
        statusColor: "emerald",
        hasInvoice: true
      },
      {
        id: "#ORD-7351",
        userName: "Tech Solutions Inc.",
        amount: "$1,499.00",
        date: "Oct 24, 2023",
        status: "Pending",
        statusColor: "amber",
        hasInvoice: true
      },
      {
        id: "#ORD-7350",
        userName: "Michael Chen",
        amount: "$49.00",
        date: "Oct 23, 2023",
        status: "Completed",
        statusColor: "emerald",
        hasInvoice: true
      },
      {
        id: "#ORD-7349",
        userName: "Jessica Williams",
        amount: "$299.00",
        date: "Oct 23, 2023",
        status: "Failed",
        statusColor: "rose",
        hasInvoice: false
      }
    ],
    actions: {
      downloadInvoice: (orderId) => console.log("Download invoice:", orderId)
    }
  },
  
  analytics: {
    metrics: [
      {
        id: "arpu",
        title: "Avg. Revenue Per User",
        value: "$42.50",
        change: "+5.2% from last month",
        changeType: "positive",
        icon: "trending-up"
      },
      {
        id: "churn",
        title: "Churn Rate",
        value: "2.4%",
        change: "-0.8% from last month",
        changeType: "positive",
        icon: "trending-down"
      },
      {
        id: "ltv",
        title: "Customer LTV",
        value: "$850.00",
        change: "Based on 12 month avg.",
        changeType: "neutral",
        icon: null
      }
    ],
    
    growthChart: {
      title: "Growth Analytics",
      type: "bar",
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: 'User Growth',
            data: [1500, 2300, 3200, 4500],
            backgroundColor: '#4f46e5',
            borderRadius: 4
          },
          {
            label: 'Churned',
            data: [200, 300, 250, 180],
            backgroundColor: '#cbd5e1',
            borderRadius: 4
          }
        ]
      }
    }
  },
  
  settings: {
    title: "Platform Settings",
    subtitle: "Manage your SaaS platform configuration",
    
    basic: {
      fields: [
        { id: "platform-name", label: "Platform Name", type: "text", value: "Pulse SaaS" },
        { id: "support-email", label: "Support Email", type: "email", value: "support@pulse.com" },
        { id: "currency", label: "Default Currency", type: "select", value: "USD", options: ["USD ($)", "EUR (€)", "GBP (£)"] }
      ]
    },
    
    features: {
      title: "Feature Toggles",
      options: [
        {
          id: "maintenance",
          label: "Maintenance Mode",
          description: "Disable access for all non-admin users",
          checked: false
        },
        {
          id: "registration",
          label: "New User Registration",
          description: "Allow new users to sign up",
          checked: true
        }
      ]
    },
    
    actions: {
      saveSettings: (data) => console.log("Save settings:", data),
      toggleFeature: (featureId, checked) => console.log("Toggle feature:", featureId, checked)
    }
  }
};