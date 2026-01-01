import { describe, it, expect } from "vitest";
import { validateRoleForm } from "../validateRoleForm";
import { Role } from "@customTypes/index";

describe("validateRoleForm", () => {
  const t = (key: string) => key;

  it("should return error for missing name", () => {
    const role: Role = {
      name: "",
      description: "",
      permissions: [],
    };

    const errors = validateRoleForm(role, t);

    expect(errors).toEqual({
      name: "roles.nameRequired",
    });
  });

  it("should return no errors when name is provided", () => {
    const role: Role = {
      name: "Admin",
      description: "Administrator role",
      permissions: [],
    };

    const errors = validateRoleForm(role, t);

    expect(errors).toEqual({});
  });

  it("should return error for whitespace-only name", () => {
    const role: Role = {
      name: "   ",
      description: "",
      permissions: [],
    };

    const errors = validateRoleForm(role, t);

    expect(errors).toEqual({
      name: "roles.nameRequired",
    });
  });
});
