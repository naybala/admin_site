import { describe, it, expect } from "vitest";
import { validateUserForm } from "../validateUserForm";
import { User } from "@customTypes/index";

describe("validateUserForm", () => {
  const t = (key: string) => key;

  it("should return errors for missing required fields", () => {
    const form: User = {
      username: "",
      email: "",
      phoneNumberPrefix: "",
      phoneNumber: "",
      roleId: "",
      companyId: "",
      userType: "",
      logo: "",
      facebook: "",
      telegram: "",
      imageFiles: null,
      fullName: "",
    };

    const errors = validateUserForm(form, t);

    expect(errors).toEqual({
      usernameRequired: "users.usernameRequired",
      phoneNumberPrefixRequired: "users.phoneNumberPrefixRequired",
      phoneNumberRequired: "users.phoneNumberRequired",
      roleIdRequired: "users.roleIdRequired",
      userTypeRequired: "users.userTypeRequired",
    });
  });

  it("should return error for invalid email", () => {
    const form: User = {
      username: "user",
      email: "invalid-email",
      phoneNumberPrefix: "+1",
      phoneNumber: "123456789",
      roleId: "1",
      userType: "admin",
    } as any;

    const errors = validateUserForm(form, t);

    expect(errors.emailRequired).toBe("users.emailRequired");
  });

  it("should return no errors when all fields are valid", () => {
    const form: User = {
      username: "johndoe",
      email: "john@example.com",
      phoneNumberPrefix: "+1",
      phoneNumber: "1234567890",
      roleId: "1",
      userType: "admin",
      companyId: null,
      logo: null,
      facebook: null,
      telegram: null,
      imageFiles: null,
      fullName: "John Doe",
    };

    const errors = validateUserForm(form, t);

    expect(errors).toEqual({});
  });

  it("should allow empty email", () => {
    const form: User = {
      username: "johndoe",
      email: "",
      phoneNumberPrefix: "+1",
      phoneNumber: "1234567890",
      roleId: "1",
      userType: "admin",
    } as any;

    const errors = validateUserForm(form, t);

    expect(errors.emailRequired).toBeUndefined();
  });
});
