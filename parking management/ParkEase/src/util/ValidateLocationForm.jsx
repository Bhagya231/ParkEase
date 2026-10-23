
export function validateLocationForm(formData) 
{
  const errors = {};

  // Location name
  if (!formData.locationName.trim())
 {
    errors.locationName = "Location name is required.";
  } else if (formData.locationName.trim().length < 3)
 {
    errors.locationName = "Location name must contain at least 3 characters.";
  }

  // Area
  if (!formData.area.trim())
 {
    errors.area = "Area is required.";
  } else if (formData.area.trim().length < 3) {
    errors.area = "Area must contain at least 3 characters.";
  }

  // Address
  if (!formData.address.trim()) {
    errors.address = "Address is required.";
  } else if (formData.address.trim().length < 10) {
    errors.address = "Address must contain at least 10 characters.";
  }

  // Opening time
  if (!formData.openTime) 
{
    errors.openTime = "Opening time is required.";
  }

  // Closing time
  if (!formData.closeTime) 
    {
    errors.closeTime = "Closing time is required.";
  } else if (
    formData.openTime &&
    formData.closeTime &&
    formData.closeTime <= formData.openTime
  ) {
    errors.closeTime = "Closing time must be later than opening time.";
  }

  return errors;
}






export function validateSlotForm(formData, isEditing) {
    const errors = {};

    if (!formData.sectionName?.trim()) {
        errors.sectionName = "Section name is required.";
    } else if (formData.sectionName.trim().length > 10) {
        errors.sectionName = "Section name cannot exceed 10 characters.";
    }

    if (isEditing) {
        if (!formData.slotNumber?.trim()) {
            errors.slotNumber = "Slot number is required.";
        } else if (formData.slotNumber.trim().length > 20) {
            errors.slotNumber = "Slot number cannot exceed 20 characters.";
        }
    } else {
        if (
            formData.startingNumber === "" ||
            !Number.isInteger(Number(formData.startingNumber)) ||
            Number(formData.startingNumber) < 1
        ) {
            errors.startingNumber = "Starting number must be a positive integer.";
        }

        if (
            formData.slotCount === "" ||
            !Number.isInteger(Number(formData.slotCount)) ||
            Number(formData.slotCount) < 1
        ) {
            errors.slotCount = "Number of slots must be a positive integer.";
        }
    }

    if (!formData.vehicleType) {
        errors.vehicleType = "Vehicle type is required.";
    }

    if (!formData.slotType) {
        errors.slotType = "Slot type is required.";
    }

    return errors;
}
