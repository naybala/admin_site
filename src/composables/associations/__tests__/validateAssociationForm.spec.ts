import { describe, it, expect, vi } from "vitest";
import { validateAssociationForm } from "../validateAssociationForm";
import { Association } from "@customTypes/index";

describe("validateAssociationForm", () => {
  const t = (key: string) => key;

  it("should return errors for missing required fields", () => {
    const form: Association = {
      name: "",
      shortName: "",
      countryId: "",
      imageFiles: null,
      logo: "",
      description: "",
    };

    const errors = validateAssociationForm(form, t);

    expect(errors).toEqual({
      nameRequired: "associations.nameRequired",
      shortNameRequired: "associations.shortNameRequired",
      countryIdRequired: "associations.countryIdRequired",
    });
  });

  it("should return no errors when all fields are valid", () => {
    const form: Association = {
      name: "Test Association",
      shortName: "TA",
      countryId: "1",
      imageFiles: null,
      logo: "",
      description: "Description",
    };

    const errors = validateAssociationForm(form, t);

    expect(errors).toEqual({});
  });

  it("should return error for whitespace-only fields", () => {
    const form: Association = {
      name: "   ",
      shortName: "  ",
      countryId: " ",
      imageFiles: null,
      logo: "",
      description: "",
    };

    const errors = validateAssociationForm(form, t);

    expect(errors).toEqual({
      nameRequired: "associations.nameRequired",
      shortNameRequired: "associations.shortNameRequired",
      countryIdRequired: "associations.countryIdRequired",
    });
  });
});
