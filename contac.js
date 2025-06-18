document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("subscription-form");
  const fullnameInput = document.getElementById("fullname");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordRepeatInput = document.getElementById("password-repeat");
  const ageInput = document.getElementById("age");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");
  const cityInput = document.getElementById("city");
  const postalCodeInput = document.getElementById("postal-code");
  const dniInput = document.getElementById("dni");
  const formTitle = document.getElementById("form-title");

  function validateFullname(value) {
    if (!value || value.trim().length <= 6) {
      return "El nombre completo debe tener más de 6 letras.";
    }
    if (!value.trim().includes(" ")) {
      return "El nombre completo debe contener al menos un espacio entre nombres.";
    }
    return "";
  }

  function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return "El formato del email no es válido.";
    }
    return "";
  }

  function validatePassword(value) {
    if (value.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!(/[a-zA-Z]/.test(value) && /\d/.test(value))) {
      return "La contraseña debe contener letras y números.";
    }
    return "";
  }

  function validatePasswordRepeat(value) {
    if (value !== passwordInput.value) {
      return "Las contraseñas no coinciden.";
    }
    return "";
  }

  function validateAge(value) {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 18) {
      return "Debe ser un número entero mayor o igual a 18.";
    }
    return "";
  }

  function validatePhone(value) {
    if (!/^\d{7,}$/.test(value)) {
      return "El teléfono debe tener al menos 7 dígitos y solo números.";
    }
    return "";
  }

  function validateAddress(value) {
    let trimmed = value.trim();
    if (trimmed.length < 5) {
      return "La dirección debe tener al menos 5 caracteres.";
    }
    if (!/\w+ \w+/.test(trimmed)) {
      return "La dirección debe contener letras, números y un espacio en el medio.";
    }
    return "";
  }

  function validateCity(value) {
    if (value.trim().length < 3) {
      return "La ciudad debe tener al menos 3 caracteres.";
    }
    return "";
  }

  function validatePostalCode(value) {
    if (value.trim().length < 3) {
      return "El código postal debe tener al menos 3 caracteres.";
    }
    return "";
  }

  function validateDni(value) {
    if (!/^\d{7,8}$/.test(value)) {
      return "El DNI debe ser un número de 7 u 8 dígitos.";
    }
    return "";
  }

  function showError(input, message) {
    const errorDiv = input.parentElement.querySelector(".error-message");
    errorDiv.textContent = message;
    input.setAttribute("aria-invalid", "true");
  }

  function clearError(input) {
    const errorDiv = input.parentElement.querySelector(".error-message");
    errorDiv.textContent = "";
    input.removeAttribute("aria-invalid");
  }

  const validators = {
    fullname: validateFullname,
    email: validateEmail,
    password: validatePassword,
    "password-repeat": validatePasswordRepeat,
    age: validateAge,
    phone: validatePhone,
    address: validateAddress,
    city: validateCity,
    "postal-code": validatePostalCode,
    dni: validateDni,
  };

  Object.keys(validators).forEach((field) => {
    const input = document.getElementById(field);
    if (!input) return;

    input.addEventListener("blur", (e) => {
      const val = e.target.value;
      const error = validators[field](val);
      if (error) {
        showError(input, error);
      } else {
        clearError(input);
      }
    });

    input.addEventListener("focus", () => {
      clearError(input);
    });
  });

  fullnameInput.addEventListener("keydown", () => {
    setTimeout(() => {
      const nameVal = fullnameInput.value.trim();
      if (nameVal) {
        formTitle.textContent = `HOLA ${nameVal}`;
      } else {
        formTitle.textContent = "HOLA";
      }
    }, 0);
  });

  fullnameInput.addEventListener("focus", () => {
    const nameVal = fullnameInput.value.trim();
    if (nameVal) {
      formTitle.textContent = `HOLA ${nameVal}`;
    } else {
      formTitle.textContent = "HOLA";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let errors = [];

    Object.keys(validators).forEach((field) => {
      const input = document.getElementById(field);
      const val = input.value;
      const validationError = validators[field](val);
      if (validationError) {
        showError(input, validationError);
        errors.push(
          `${input.previousElementSibling.textContent}: ${validationError}`
        );
      } else {
        clearError(input);
      }
    });

    if (errors.length > 0) {
      alert("Hay errores en el formulario:\n\n" + errors.join("\n"));
      return;
    }

    const formData = {
      "Nombre completo": fullnameInput.value.trim(),
      Email: emailInput.value.trim(),
      Contraseña: passwordInput.value,
      Edad: ageInput.value,
      Teléfono: phoneInput.value.trim(),
      Dirección: addressInput.value.trim(),
      Ciudad: cityInput.value.trim(),
      "Código Postal": postalCodeInput.value.trim(),
      DNI: dniInput.value.trim(),
    };
    const formattedData = Object.entries(formData)
      .map(([key, val]) => `${key}: ${val}`)
      .join("\n");

    alert(
      "Formulario enviado correctamente con los datos:\n\n" + formattedData
    );
    form.reset();
    formTitle.textContent = "HOLA";
  });
});
