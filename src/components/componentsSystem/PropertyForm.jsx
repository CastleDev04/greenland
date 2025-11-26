import React, { useState } from "react";

const PropertyForm = ({ initialData = {}, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    fraccionamiento: "",
    distrito: "",
    finca: "",
    padron: "",
    cuentaCatastral: "",
    manzana: "",
    lote: "",
    loteamiento: "",
    superficie: 0,
    precioTotal: 0,
    modalidadPago: "",
    cuotas: null,
    montoCuota: null,
    estadoVenta: "Disponible",
    entregado: false,
    amojonado: false,
    limpio: false,
    tieneConstruccion: false,
    aguaPotable: false,
    energiaElectrica: false,
    calle: false,
    seguridad: false,
    beneficiosComunes: [],
    requiereExpensas: false,
    expensas: null,
    restriccionConstrucion: [],
    latitud: null,
    longitud: null,
    linderoNorteMedida: null,
    linderoSurMedida: null,
    linderoEsteMedida: null,
    linderoOesteMedida: null,
    linderoNorteCon: "",
    linderoSurCon: "",
    linderoEsteCon: "",
    linderoOesteCon: "",
    linderoNorteCalle: "",
    linderoSurCalle: "",
    linderoEsteCalle: "",
    linderoOesteCalle: "",
    imagenes: [],
    compradorId: null,
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  // 🔥 CORRECCIÓN: Función segura para obtener array
  const getSafeArray = (field) => {
    return Array.isArray(formData[field]) ? formData[field] : [];
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // 🔥 CORRECCIÓN: Función segura para manejar arrays
  const handleArrayChange = (field, value) => {
    const arrayValue = value 
      ? value.split(",").map((v) => v.trim()).filter(v => v !== "")
      : [];
    
    setFormData((prev) => ({
      ...prev,
      [field]: arrayValue,
    }));
  };

  const handleNumberChange = (field, value) => {
    const numValue = value === "" ? null : parseFloat(value);
    handleChange(field, numValue);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fraccionamiento.trim()) newErrors.fraccionamiento = "Fraccionamiento es requerido";
    if (!formData.distrito.trim()) newErrors.distrito = "Distrito es requerido";
    if (!formData.finca.trim()) newErrors.finca = "Finca es requerida";
    if (!formData.padron.trim()) newErrors.padron = "Padrón es requerido";
    if (!formData.manzana.trim()) newErrors.manzana = "Manzana es requerida";
    if (!formData.lote.trim()) newErrors.lote = "Lote es requerido";
    if (!formData.loteamiento.trim()) newErrors.loteamiento = "Loteamiento es requerido";
    if (formData.superficie <= 0) newErrors.superficie = "Superficie debe ser mayor a 0";
    if (formData.precioTotal <= 0) newErrors.precioTotal = "Precio total debe ser mayor a 0";
    if (!formData.modalidadPago) newErrors.modalidadPago = "Modalidad de pago es requerida";

    if (formData.modalidadPago === "Credito") {
      if (!formData.cuotas || formData.cuotas <= 0) {
        newErrors.cuotas = "Número de cuotas es requerido para crédito";
      }
      if (!formData.montoCuota || formData.montoCuota <= 0) {
        newErrors.montoCuota = "Monto de cuota es requerido para crédito";
      }
    }

    if (formData.requiereExpensas && (!formData.expensas || formData.expensas <= 0)) {
      newErrors.expensas = "Monto de expensas es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderInput = (field, label, type = "text", required = false, placeholder = "") => (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder || label}
        value={formData[field] || ""}
        onChange={(e) => handleChange(field, e.target.value)}
        className={`border p-2 rounded w-full ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
      />
      {errors[field] && <span className="text-red-500 text-xs mt-1">{errors[field]}</span>}
    </div>
  );

  const renderNumberInput = (field, label, required = false, min = null) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="number"
        step="any"
        min={min}
        placeholder={label}
        value={formData[field] || ""}
        onChange={(e) => handleNumberChange(field, e.target.value)}
        className={`border p-2 rounded w-full ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
      />
      {errors[field] && <span className="text-red-500 text-xs mt-1">{errors[field]}</span>}
    </div>
  );

  const renderCheckbox = (field, label) => (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={formData[field]}
        onChange={(e) => handleChange(field, e.target.checked)}
        className="w-4 h-4"
      />
      <span className="text-sm">{label}</span>
    </label>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData.id ? "Editar Lote" : "Nuevo Lote"}
      </h2>
      
      <div className="space-y-8">
        {/* SECCIÓN: Datos Básicos */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">📋 Datos Básicos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderInput("fraccionamiento", "Fraccionamiento", "text", true)}
            {renderInput("distrito", "Distrito", "text", true)}
            {renderInput("finca", "Finca", "text", true)}
            {renderInput("padron", "Padrón", "text", true)}
            {renderInput("cuentaCatastral", "Cuenta Catastral")}
            {renderInput("manzana", "Manzana", "text", true)}
            {renderInput("lote", "Lote", "text", true)}
            {renderInput("loteamiento", "Loteamiento", "text", true)}
            {renderNumberInput("superficie", "Superficie (m²)", true, 0)}
          </div>
        </section>

        {/* SECCIÓN: Información de Venta */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-green-600">💰 Información de Venta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderNumberInput("precioTotal", "Precio Total", true, 0)}
            
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Modalidad de Pago <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.modalidadPago}
                onChange={(e) => handleChange("modalidadPago", e.target.value)}
                className={`border p-2 rounded w-full ${errors.modalidadPago ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Seleccione modalidad</option>
                <option value="Contado">Contado</option>
                <option value="Credito">Crédito</option>
              </select>
              {errors.modalidadPago && <span className="text-red-500 text-xs mt-1">{errors.modalidadPago}</span>}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Estado de Venta</label>
              <select
                value={formData.estadoVenta}
                onChange={(e) => handleChange("estadoVenta", e.target.value)}
                className="border p-2 rounded w-full border-gray-300"
              >
                <option value="Disponible">Disponible</option>
                <option value="Reservado">Reservado</option>
                <option value="Vendido">Vendido</option>
              </select>
            </div>

            {formData.modalidadPago === "Credito" && (
              <>
                {renderNumberInput("cuotas", "Número de Cuotas", true, 1)}
                {renderNumberInput("montoCuota", "Monto por Cuota", true, 0)}
              </>
            )}
          </div>
        </section>

        {/* SECCIÓN: Estado del Lote */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">🏗️ Estado del Lote</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {renderCheckbox("entregado", "Entregado")}
            {renderCheckbox("amojonado", "Amojonado")}
            {renderCheckbox("limpio", "Limpio")}
            {renderCheckbox("tieneConstruccion", "Tiene Construcción")}
          </div>
        </section>

        {/* SECCIÓN: Servicios */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">🔧 Servicios Disponibles</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {renderCheckbox("aguaPotable", "Agua Potable")}
            {renderCheckbox("energiaElectrica", "Energía Eléctrica")}
            {renderCheckbox("calle", "Calle")}
            {renderCheckbox("seguridad", "Seguridad")}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 🔥 CORREGIDO: Beneficios Comunes con protección de array */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Beneficios Comunes</label>
              <input
                type="text"
                placeholder="Separados por coma (ej: piscina, gimnasio, parque)"
                value={getSafeArray("beneficiosComunes").join(", ")}
                onChange={(e) => handleArrayChange("beneficiosComunes", e.target.value)}
                className="border p-2 rounded w-full border-gray-300"
              />
            </div>
            
            {/* 🔥 CORREGIDO: Restricciones de Construcción con protección de array */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Restricciones de Construcción</label>
              <input
                type="text"
                placeholder="Separadas por coma"
                value={getSafeArray("restriccionConstrucion").join(", ")}
                onChange={(e) => handleArrayChange("restriccionConstrucion", e.target.value)}
                className="border p-2 rounded w-full border-gray-300"
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN: Expensas */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-yellow-600">💳 Expensas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderCheckbox("requiereExpensas", "Requiere Expensas")}
            {formData.requiereExpensas && renderNumberInput("expensas", "Monto de Expensas", true, 0)}
          </div>
        </section>

        {/* SECCIÓN: Ubicación */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-red-600">📍 Ubicación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderNumberInput("latitud", "Latitud")}
            {renderNumberInput("longitud", "Longitud")}
          </div>
        </section>

        {/* SECCIÓN: Linderos */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-indigo-600">📏 Linderos</h3>
          
          {/* Norte */}
          <div className="mb-6">
            <h4 className="font-medium mb-3 text-gray-700">Norte</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderNumberInput("linderoNorteMedida", "Medida Norte (m)")}
              {renderInput("linderoNorteCon", "Lindero Norte Con")}
              {renderInput("linderoNorteCalle", "Calle Norte")}
            </div>
          </div>

          {/* Sur */}
          <div className="mb-6">
            <h4 className="font-medium mb-3 text-gray-700">Sur</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderNumberInput("linderoSurMedida", "Medida Sur (m)")}
              {renderInput("linderoSurCon", "Lindero Sur Con")}
              {renderInput("linderoSurCalle", "Calle Sur")}
            </div>
          </div>

          {/* Este */}
          <div className="mb-6">
            <h4 className="font-medium mb-3 text-gray-700">Este</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderNumberInput("linderoEsteMedida", "Medida Este (m)")}
              {renderInput("linderoEsteCon", "Lindero Este Con")}
              {renderInput("linderoEsteCalle", "Calle Este")}
            </div>
          </div>

          {/* Oeste */}
          <div className="mb-6">
            <h4 className="font-medium mb-3 text-gray-700">Oeste</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderNumberInput("linderoOesteMedida", "Medida Oeste (m)")}
              {renderInput("linderoOesteCon", "Lindero Oeste Con")}
              {renderInput("linderoOesteCalle", "Calle Oeste")}
            </div>
          </div>
        </section>

        {/* SECCIÓN: Imágenes */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-pink-600">🖼️ Imágenes</h3>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">URLs de Imágenes</label>
            <input
              type="text"
              placeholder="URLs separadas por coma"
              value={getSafeArray("imagenes").join(", ")}
              onChange={(e) => handleArrayChange("imagenes", e.target.value)}
              className="border p-2 rounded w-full border-gray-300"
            />
            <small className="text-gray-500 mt-1">
              Ingrese las URLs de las imágenes separadas por comas
            </small>
          </div>
        </section>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {initialData.id ? "Actualizar Lote" : "Crear Lote"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;