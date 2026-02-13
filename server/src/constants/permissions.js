export const PERMISSIONS = {
  USER: {
    group: "User Permissions",
    items: [
      { key: "users.create", label: "Create Users" },
      { key: "users.view", label: "View Users" },
      { key: "users.update", label: "Update Users" },
      { key: "users.delete", label: "Delete Users" }
    ]
  },
  LEAD: {
    group: "Lead Permissions",
    items: [
      { key: "leads.create", label: "Create Leads" },
      { key: "leads.view", label: "View Leads" },
      { key: "leads.update", label: "Update Leads" },
      { key: "leads.delete", label: "Delete Leads" }
    ]
  },
  PROPERTY: {
    group: "Property Permissions",
    items: [
      { key: "properties.create", label: "Create Properties" },
      { key: "properties.view", label: "View Properties" },
      { key: "properties.update", label: "Update Properties" },
      { key: "properties.delete", label: "Delete Properties" }
    ]
  },
  ACTIVITY: {
    group: "Activity Permissions",
    items: [
      { key: "activities.create", label: "Create Activities" },
      { key: "activities.view", label: "View Activities" },
      { key: "activities.update", label: "Update Activities" },
      { key: "activities.delete", label: "Delete Activities" }
    ]
  },
  SYSTEM: {
    group: "System Permissions",
    items: [{ key: "system.manage", label: "System Management" }]
  },
  REPORT: {
    group: "Report Permissions",
    items: [{ key: "reports.view", label: "View Reports" }]
  },
  DATA: {
    group: "Data Permissions",
    items: [
      { key: "data.export", label: "Export Data" },
      { key: "data.import", label: "Import Data" }
    ]
  }
};

export const ALL_PERMISSION_KEYS = Object.values(PERMISSIONS)
  .flatMap((g) => g.items.map((i) => i.key));

export const PERMISSION_GROUPS = Object.values(PERMISSIONS).map((g) => ({
  group: g.group,
  items: g.items
}));
