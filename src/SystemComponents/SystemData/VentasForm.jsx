import { useState, useEffect } from "react";
import {
  User, DollarSign, MapPin, FileText, X, Loader2,
  ChevronRight, ChevronLeft, Check, Building2,
  Zap, Droplets, Shield, AlertCircle, Edit3,
  Eye, Printer, CreditCard, Calendar,
  Percent, Landmark, Ruler, Trees,
  BadgeCheck, ToggleLeft, ToggleRight
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────
const ONES = ["","UNO","DOS","TRES","CUATRO","CINCO","SEIS","SIETE","OCHO","NUEVE",
  "DIEZ","ONCE","DOCE","TRECE","CATORCE","QUINCE","DIECISÉIS","DIECISIETE","DIECIOCHO","DIECINUEVE"];
const TENS = ["","","VEINTE","TREINTA","CUARENTA","CINCUENTA","SESENTA","SETENTA","OCHENTA","NOVENTA"];
const HUNDREDS = ["","CIENTO","DOSCIENTOS","TRESCIENTOS","CUATROCIENTOS","QUINIENTOS",
  "SEISCIENTOS","SETECIENTOS","OCHOCIENTOS","NOVECIENTOS"];

function chunkToWords(n) {
  if (n === 0) return "";
  if (n === 100) return "CIEN";
  let s = "";
  if (Math.floor(n/100)) s += HUNDREDS[Math.floor(n/100)] + " ";
  const r = n % 100;
  if (r < 20) s += ONES[r];
  else { s += TENS[Math.floor(r/10)]; if (r%10) s += " Y " + ONES[r%10]; }
  return s.trim();
}

function numberToWords(n) {
  if (!n || isNaN(n)) return "";
  const num = Math.floor(Number(n));
  if (num === 0) return "CERO GUARANÍES";
  const billions = Math.floor(num/1_000_000_000);
  const millions = Math.floor((num%1_000_000_000)/1_000_000);
  const thousands = Math.floor((num%1_000_000)/1_000);
  const remainder = num%1_000;
  let r = "";
  if (billions) r += chunkToWords(billions)+(billions===1?" MIL MILLÓN ":" MIL MILLONES ");
  if (millions) r += chunkToWords(millions)+(millions===1?" MILLÓN ":" MILLONES ");
  if (thousands) r += (thousands===1?"MIL ":chunkToWords(thousands)+" MIL ");
  if (remainder) r += chunkToWords(remainder);
  return r.trim() + " GUARANÍES";
}

const fmt = (n) => n ? Number(n).toLocaleString("es-PY") : "0";

const fmtDate = (d) => {
  if (!d) return "___";
  const [y,m,day] = d.split("-");
  const months = ["enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${Number(day)} de ${months[Number(m)-1]} de ${y}`;
};

// ─── primitives ──────────────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, iconColor, title, children }) => (
  <div className="bg-gray-50 p-5 rounded-xl">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <Icon size={20} className={iconColor} />{title}
    </h3>
    {children}
  </div>
);

const Field = ({ label, error, children, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const inputBase = "w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";
const inputNormal = `${inputBase} border-gray-300 bg-white hover:border-gray-400`;
const inputReadOnly = `${inputBase} border-gray-200 bg-gray-100 text-gray-500 cursor-default`;

const StepDot = ({ index, current, label }) => {
  const done = index < current;
  const active = index === current;
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
        ${done?"bg-emerald-500 text-white":active?"bg-gray-800 text-white ring-4 ring-gray-800/10":"bg-gray-100 text-gray-400 border border-gray-200"}`}>
        {done?<Check size={14}/>:index+1}
      </div>
      <span className={`text-xs hidden sm:block tracking-wide ${active?"text-gray-800 font-medium":done?"text-emerald-600":"text-gray-400"}`}>{label}</span>
    </div>
  );
};

const ToggleChip = ({ icon: Icon, label, checked, onChange }) => (
  <button type="button" onClick={onChange}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all w-full
      ${checked?"bg-emerald-50 border-emerald-300 text-emerald-700":"bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}>
    <Icon size={13} className="shrink-0"/>
    <span className="truncate">{label}</span>
    <span className="ml-auto">{checked?<ToggleRight size={16} className="text-emerald-500"/>:<ToggleLeft size={16} className="text-gray-300"/>}</span>
  </button>
);

// ─── contract ────────────────────────────────────────────────────────────────
const ContractPreview = ({ cliente, venta, lote }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-7 text-sm text-gray-800 leading-relaxed" style={{fontFamily:"Georgia,serif"}}>
    <div className="text-center mb-5">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Las Lomas Country</p>
      <h2 className="text-xl font-bold tracking-tight">CONTRATO DE COMPRA – VENTA DE INMUEBLE</h2>
    </div>

    <table className="w-full border-collapse text-xs mb-5" style={{fontFamily:"sans-serif"}}>
      <tbody>
        {[
          ["Finca N°",lote?.finca||"—","Padrón N°",lote?.padron||"—","Cta. Catastral",lote?.cuentaCatastral||"A DEFINIR"],
          ["Distrito",lote?.distrito||"—","Fraccionamiento",lote?.fraccionamiento||"—","Loteamiento N°",lote?.loteamiento||"—"],
          ["Manzana",lote?.manzana||"—","Lote N°",lote?.lote||"—","Superficie m²",lote?.superficie||"—"],
        ].map((row,i)=>(
          <tr key={i}>
            <td className="border border-gray-200 bg-gray-50 px-2 py-1 font-semibold text-gray-500 uppercase">{row[0]}</td>
            <td className="border border-gray-200 px-2 py-1">{row[1]}</td>
            <td className="border border-gray-200 bg-gray-50 px-2 py-1 font-semibold text-gray-500 uppercase">{row[2]}</td>
            <td className="border border-gray-200 px-2 py-1">{row[3]}</td>
            <td className="border border-gray-200 bg-gray-50 px-2 py-1 font-semibold text-gray-500 uppercase">{row[4]}</td>
            <td className="border border-gray-200 px-2 py-1">{row[5]}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <p className="mb-4 text-justify">
      En Asunción, Capital de la República del Paraguay a los <strong>{fmtDate(venta.fechaContrato)}</strong>, entre <strong>NELSON GERARDO CORONEL</strong> C.I. No. 2.321.486 y <strong>TADEO ANDRES ALVAREZ ORTIZ</strong> C.I. No. 5.934.260, en adelante los <strong>"Vendedores"</strong>, y por la otra: <strong>{(cliente.nombre+" "+cliente.apellido).toUpperCase()||"___"}</strong> con C.I. Nº <strong>{cliente.cedula||"___"}</strong>, de nacionalidad <strong>{cliente.nacionalidad||"___"}</strong>, estado civil <strong>{cliente.estadoCivil||"___"}</strong>, domicilio en <strong>{cliente.direccion||"___"}</strong>, ciudad de <strong>{cliente.ciudad||"___"}</strong>, tel. <strong>{cliente.telefono||"___"}</strong>, denominado el <strong>"Comprador"</strong>.
    </p>

    {[
      ["PRIMERA: DEL OBJETO", `Los vendedores venden y el comprador compra el terreno ubicado en el fraccionamiento ${lote?.fraccionamiento?.toUpperCase()||"___"}, Distrito de ${lote?.distrito||"___"}, Lote N° ${lote?.lote||"___"}, Manzana ${lote?.manzana||"___"}, Loteamiento ${lote?.loteamiento||"___"}, FINCA N° ${lote?.finca||"___"} del PADRÓN N° ${lote?.padron||"___"}.`],
      ["SEGUNDA: DEL MONTO Y FORMA DE PAGO", `La venta se realiza al ${venta.tipoPago==="Contado"?"CONTADO":"CReDITO"} por Gs. ${fmt(venta.montoTotal)} (${venta.montoTexto||"___"}).${venta.tipoPago==="Financiado"&&venta.cantidadCuotas?` Se abonará en ${venta.cantidadCuotas} cuotas de Gs. ${fmt(venta.montoCuota)}, con vencimiento el día ${venta.diaVencimiento} de cada mes. Tasa de interés moratorio: ${venta.tasaInteresMoratorio||"___"}%. Multa por mora diaria: ${venta.multaMoraDiaria||"___"}%.`:""}`],
      ["TERCERA: DE LA ENTREGA Y POSESIÓN", `Los Vendedores hacen entrega de la posesión inmediata y plena del inmueble al Comprador a partir del ${fmtDate(venta.fechaInicio)}, con los beneficios comunes del Country.`],
      ["CUARTA: DEL ANEXO", "Forma parte del presente contrato el Reglamento de Convivencia y Construcción (RCC) de LAS LOMAS COUNTRY, plenamente aceptado por el Comprador."],
      ["QUINTA: RESPONSABILIDAD DE LOS VENDEDORES", "Se circunscribe a las obligaciones de los beneficios comunes y la tramitación de la transferencia respectiva."],
      ["SEXTA: PARTE FINAL", "Las partes acuerdan buscar solución extrajudicial, fijando jurisdicción en los tribunales de la ciudad de Asunción, República del Paraguay."],
    ].map(([title,text])=>(
      <div key={title} className="mb-3 text-justify">
        <strong className="underline">{title}: </strong>{text}
      </div>
    ))}

    <div className="grid grid-cols-2 gap-12 mt-10">
      {["Vendedor — Nelson G. Coronel",`Comprador — ${cliente.nombre} ${cliente.apellido}`,"Vendedor — Tadeo A. Álvarez Ortiz","Comprador"].map(l=>(
        <div key={l} className="text-center">
          <div className="border-t border-gray-800 pt-2 mt-10 text-xs uppercase tracking-wide text-gray-500" style={{fontFamily:"sans-serif"}}>{l}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── main ─────────────────────────────────────────────────────────────────────
export default function VentasForm({ onSubmit, onCancel, clientes = [], lotes = [], loading = false, ventaData }) {
  const [step, setStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [editandoLote, setEditandoLote] = useState(false);
  const [editandoCliente, setEditandoCliente] = useState(false);
  const [crearClienteNuevo, setCrearClienteNuevo] = useState(true);

  const [cliente, setCliente] = useState({
    nombre:"", apellido:"", cedula:"", nacionalidad:"Paraguaya",
    estadoCivil:"", direccion:"", ciudad:"", telefono:"", email:"",
    ruc:"", profesion:""
  });

  const [venta, setVenta] = useState({
    fechaContrato: new Date().toISOString().split("T")[0],
    fechaInicio: new Date().toISOString().split("T")[0],
    estado: "pendiente",
    montoTotal: "", montoTexto: "",
    tipoPago: "Contado",
    cantidadCuotas: "", montoCuota: "",
    diaVencimiento: "10",
    tasaInteresMoratorio: "", multaMoraDiaria: "",
  });
  const [clienteId, setClienteId] = useState("");
  const [loteId, setLoteId] = useState("");
  const [lote, setLote] = useState(null);

  useEffect(() => {
    setVenta(v => ({ ...v, montoTexto: v.montoTotal ? numberToWords(v.montoTotal) : "" }));
  }, [venta.montoTotal]);


  useEffect(() => {
  if (!ventaData) return;

  // CLIENTE
  if (ventaData.cliente) {
    setCliente(ventaData.cliente);
    setClienteId(String(ventaData.cliente.id));
  }

  // VENTA
  setVenta({
    fechaContrato: ventaData.fechaContrato || "",
    fechaInicio: ventaData.fechaInicio || "",
    estado: ventaData.estado || "pendiente",
    montoTotal: ventaData.montoTotal || "",
    montoTexto: ventaData.montoTexto || "",
    tipoPago: ventaData.tipoPago || "Contado",
    cantidadCuotas: ventaData.cantidadCuotas || "",
    montoCuota: ventaData.montoCuota || "",
    diaVencimiento: ventaData.diaVencimiento || "10",
    tasaInteresMoratorio: ventaData.tasaInteresMoratorio || "",
    multaMoraDiaria: ventaData.multaMoraDiaria || "",
  });

  // LOTE
  if (ventaData.lote) {
    setLote(ventaData.lote);
    setLoteId(String(ventaData.lote.id));
  }

}, [ventaData]);

  const handleSelectCliente = (e) => {
  const id = e.target.value;

  setClienteId(id);

  if (!id) {
    setCliente({
      nombre: "",
      apellido: "",
      cedula: "",
      ruc: "",
      profesion: "",
      telefono: "",
      email: "",
      ciudad: "",
      estadoCivil: "",
      nacionalidad: "Paraguaya",
      direccion: "",
    });

    return;
  }

  const clienteSeleccionado = clientes.find(
    c => String(c.id) === id
  );

  if (clienteSeleccionado) {
    setCliente(clienteSeleccionado);
  }
};

  const setL = (f, val) => setLote(l => ({ ...l, [f]: val }));

  const handleSelectLote = (e) => {
  const id = e.target.value;
  setLoteId(id);
  const found = lotes.find(l => String(l.id) === id) || null;
  setLote(found ? { ...found } : null);
  
  if (found?.precioTotal) {
    // ✅ CORREGIDO: Detectar si hay punto decimal
    const precioStr = String(found.precioTotal).trim();
    
    let precioLimpio;
    
    // Si hay punto, verificar si es decimal o separador de miles
    if (precioStr.includes(',')) {
      const partes = precioStr.split(',');
      
      // Si la última parte tiene ≤ 2 dígitos → es decimal
      if (partes[partes.length - 1].length <= 2) {
        // Formato: 122.218.000,00 o 122218000.00
        precioLimpio = Number(
          precioStr
            .replace(/\./g, '')      // Elimina miles
            .replace(',', ',')       // Convierte coma a punto para decimal
        );
      } else {
        // Es separador de miles: 122,218,000.00
        precioLimpio = Number(
          precioStr.replace(/,/g, '')
        );
      }
    } else {
      // Sin puntos/comas: 122218000
      precioLimpio = Number(precioStr);
    }

    console.log("Precio original:", found.precioTotal);
    console.log("Precio limpio:", precioLimpio);

    setVenta(v => ({
      ...v,
      montoTotal: precioLimpio
    }));
  }
};


  const handleCuotas = (val) => setVenta(v => ({
    ...v, cantidadCuotas: val,
    montoCuota: v.montoTotal && val ? Math.round(Number(v.montoTotal)/Number(val)) : ""
  }));

  const handleTipoPago = (tipo) => setVenta(v => ({
    ...v, tipoPago: tipo,
    cantidadCuotas: tipo==="Contado"?"1":"",
    montoCuota: tipo==="Contado"?v.montoTotal:"",
    tasaInteresMoratorio:"", multaMoraDiaria:""
  }));

 const handleSubmit = () => {

  console.log("========== DATOS A ENVIAR ==========");
  console.log({
    cliente,
    ...venta,
    lote_id: loteId,
    lote
  });

  onSubmit?.({
    cliente,
    ...venta,
    lote_id: loteId,
    lote
  });
};

  const steps = ["Cliente","Venta","Lote","Resumen"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-0 border-b border-gray-100">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Nueva Venta</h2>
              <p className="text-gray-500 text-sm mt-0.5">Las Lomas Country · Registrar compraventa de inmueble</p>
            </div>
            <button onClick={onCancel} disabled={loading} className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors p-1">
              <X size={22}/>
            </button>
          </div>

          {/* stepper */}
          <div className="flex items-start pb-5 relative">
            <div className="absolute top-4 left-[6%] right-[6%] h-px bg-gray-200 z-0"/>
            {steps.map((label,i) => <StepDot key={i} index={i} current={step} label={label}/>)}
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* ══ STEP 0 · CLIENTE ══ */}
          {step === 0 && (
  <>
    {/* selector de cliente */}
    <SectionCard
      icon={User}
      iconColor="text-blue-500"
      title="Seleccionar Cliente"
    >
      <Field label="Cliente existente">
        <select
          className={inputNormal}
          value={clienteId}
          onChange={handleSelectCliente}
        >
          <option value="">— Crear nuevo cliente —</option>

          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido} · CI: {c.cedula}
            </option>
          ))}
        </select>
      </Field>
    </SectionCard>

    {/* formulario */}
    <SectionCard
      icon={User}
      iconColor="text-blue-500"
      title="Datos del Comprador"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {name:"nombre",label:"Nombre *"},
          {name:"apellido",label:"Apellido *"},
          {name:"cedula",label:"Cédula de Identidad *"},
          {name:"ruc",label:"RUC"},
          {name:"profesion",label:"Profesión"},
          {name:"telefono",label:"Teléfono"},
          {name:"email",label:"Correo Electrónico"},
          {name:"ciudad",label:"Ciudad"},
        ].map(f=>(
          <Field key={f.name} label={f.label}>
            <input
              className={inputNormal}
              name={f.name}
              value={cliente[f.name] || ""}
              onChange={e =>
                setCliente(c => ({
                  ...c,
                  [e.target.name]: e.target.value
                }))
              }
              placeholder={`Ingrese ${f.label.replace(" *","").toLowerCase()}`}
            />
          </Field>
        ))}

        <Field label="Estado Civil">
          <select
            className={inputNormal}
            value={cliente.estadoCivil || ""}
            onChange={e =>
              setCliente(c => ({
                ...c,
                estadoCivil:e.target.value
              }))
            }
          >
            <option value="">Seleccione estado civil</option>

            {[
              "Soltero/a",
              "Casado/a",
              "Divorciado/a",
              "Viudo/a",
              "Unión de hecho"
            ].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label="Nacionalidad">
          <select
            className={inputNormal}
            value={cliente.nacionalidad || ""}
            onChange={e =>
              setCliente(c => ({
                ...c,
                nacionalidad:e.target.value
              }))
            }
          >
            {[
              "Paraguaya",
              "Argentina",
              "Brasileña",
              "Boliviana",
              "Uruguaya",
              "Chilena",
              "Otra"
            ].map(n => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </Field>

        <Field label="Domicilio" className="md:col-span-2">
          <input
            className={inputNormal}
            value={cliente.direccion || ""}
            onChange={e =>
              setCliente(c => ({
                ...c,
                direccion:e.target.value
              }))
            }
            placeholder="Dirección completa"
          />
        </Field>
      </div>
    </SectionCard>
  </>
)}

          {/* ══ STEP 1 · VENTA ══ */}
          {step === 1 && (
            <>
              {/* fechas */}
              <SectionCard icon={Calendar} iconColor="text-violet-500" title="Fechas y Estado">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Fecha de Contrato">
                    <input type="date" className={inputNormal} value={venta.fechaContrato}
                      onChange={e=>setVenta(v=>({...v,fechaContrato:e.target.value}))}/>
                  </Field>
                  <Field label="Fecha de Inicio de Posesión">
                    <input type="date" className={inputNormal} value={venta.fechaInicio}
                      onChange={e=>setVenta(v=>({...v,fechaInicio:e.target.value}))}/>
                  </Field>
                  <Field label="Estado">
                    <select className={inputNormal} value={venta.estado} onChange={e=>setVenta(v=>({...v,estado:e.target.value}))}>
                      {["pendiente","pagado","cancelado"].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              </SectionCard>

              {/* monto */}
              <SectionCard icon={DollarSign} iconColor="text-emerald-500" title="Monto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Monto Total (Gs.)">
                    <input type="number" className={inputNormal} value={venta.montoTotal}
                      onChange={e=>setVenta(v=>({...v,montoTotal:e.target.value}))} placeholder="0"/>
                  </Field>
                  <Field label="Monto en Texto (generado automáticamente)">
                    <input readOnly className={inputReadOnly} value={venta.montoTexto}
                      style={{fontSize:".72rem",textTransform:"uppercase"}} placeholder="Se completa al ingresar el monto"/>
                  </Field>
                </div>
              </SectionCard>

              {/* modalidad */}
              <SectionCard icon={CreditCard} iconColor="text-orange-500" title="Modalidad de Pago">
                <div className="flex gap-3 mb-4">
                  {["Contado","Credito"].map(t=>(
                    <button key={t} type="button" onClick={()=>handleTipoPago(t)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all
                        ${venta.tipoPago===t?"bg-gray-800 text-white border-gray-800":"bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                      {t === "Financiado" ? "Credito" : t}
                    </button>
                  ))}
                </div>

                {venta.tipoPago==="Credito" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Cantidad de Cuotas">
                      <input type="number" className={inputNormal} value={venta.cantidadCuotas}
                        onChange={e=>handleCuotas(e.target.value)} placeholder="Ej: 12"/>
                    </Field>
                    <Field label="Monto por Cuota (Gs.) *">
                      <input type="number" className={inputNormal}
                        value={venta.montoCuota} 
                        onChange={e=>setVenta(v=>({...v,montoCuota:e.target.value}))}
                        placeholder="Monto de Cuota"/>
                    </Field>
                    <Field label="Día de Vencimiento">
                      <select className={inputNormal} value={venta.diaVencimiento}
                        onChange={e=>setVenta(v=>({...v,diaVencimiento:e.target.value}))}>
                        {Array.from({length:28},(_,i)=>i+1).map(d=><option key={d} value={d}>Día {d}</option>)}
                      </select>
                    </Field>
                    <div/>
                    <Field label="Tasa Interés Moratorio (%)">
                      <div className="relative">
                        <input type="number" step="0.01" className={inputNormal+" pr-8"} value={venta.tasaInteresMoratorio}
                          onChange={e=>setVenta(v=>({...v,tasaInteresMoratorio:e.target.value}))} placeholder="0.00"/>
                        <Percent size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      </div>
                    </Field>
                    <Field label="Multa por Mora Diaria (%)">
                      <div className="relative">
                        <input type="number" step="0.01" className={inputNormal+" pr-8"} value={venta.multaMoraDiaria}
                          onChange={e=>setVenta(v=>({...v,multaMoraDiaria:e.target.value}))} placeholder="0.00"/>
                        <Percent size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      </div>
                    </Field>
                  </div>
                )}
              </SectionCard>
            </>
          )}

          {/* ══ STEP 2 · LOTE ══ */}
          {step === 2 && (
            <>
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                <AlertCircle size={16} className="mt-0.5 shrink-0"/>
                <span>Los datos del lote se cargan desde la base de datos. Podés editar los campos si necesitás corregir información antes de generar el contrato.</span>
              </div>

              <SectionCard icon={MapPin} iconColor="text-emerald-500" title="Seleccionar Lote">
                <Field label="Lote disponible">
                  <select className={inputNormal} value={loteId} onChange={handleSelectLote}>
                    <option value="">— Elegir lote —</option>
                    {lotes.map(l=>(
                      <option key={l.id} value={String(l.id)}>
                        {l.fraccionamiento} · Manzana {l.manzana} · Lote {l.lote}
                      </option>
                    ))}
                  </select>
                </Field>
              </SectionCard>

              {lote && (
                <>
                  {/* identificación */}
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Landmark size={20} className="text-blue-500"/>Identificación Registral
                      </h3>
                      <button type="button" onClick={()=>setEditandoLote(!editandoLote)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all
                          ${editandoLote?"bg-emerald-50 border-emerald-300 text-emerald-700":"bg-white border-gray-200 text-gray-500 hover:border-gray-400"}`}>
                        <Edit3 size={12}/>{editandoLote?"Listo":"Editar datos"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        {f:"fraccionamiento",l:"Fraccionamiento"},{f:"distrito",l:"Distrito"},{f:"loteamiento",l:"Loteamiento N°"},
                        {f:"finca",l:"Finca N°"},{f:"padron",l:"Padrón N°"},{f:"cuentaCatastral",l:"Cta. Catastral"},
                        {f:"manzana",l:"Manzana"},{f:"lote",l:"Lote N°"},{f:"superficie",l:"Superficie m²"},
                      ].map(({f,l})=>(
                        <Field key={f} label={l}>
                          <input className={editandoLote?inputNormal:inputReadOnly} readOnly={!editandoLote}
                            value={lote[f]??""} onChange={e=>setL(f,e.target.value)}/>
                        </Field>
                      ))}
                    </div>
                  </div>

                  {/* linderos */}
                  <SectionCard icon={Ruler} iconColor="text-purple-500" title="Linderos">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            {["Orientación","Medida (mts)","Linda con Lote N°","Calle"].map(h=>(
                              <th key={h} className="text-left py-2 px-3 text-xs uppercase tracking-wide text-gray-500 font-medium first:rounded-l-lg last:rounded-r-lg">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {[
                            {dir:"Norte",med:"linderoNorteMedida",con:"linderoNorteCon",calle:"linderoNorteCalle"},
                            {dir:"Sur",  med:"linderoSurMedida",  con:"linderoSurCon",  calle:"linderoSurCalle"},
                            {dir:"Este", med:"linderoEsteMedida", con:"linderoEsteCon", calle:"linderoEsteCalle"},
                            {dir:"Oeste",med:"linderoOesteMedida",con:"linderoOesteCon",calle:"linderoOesteCalle"},
                          ].map(row=>(
                            <tr key={row.dir} className="bg-white">
                              <td className="py-2 px-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 uppercase tracking-wide">{row.dir}</span>
                              </td>
                              {[row.med,row.con,row.calle].map(f=>(
                                <td key={f} className="py-1.5 px-2">
                                  <input className={(editandoLote?inputNormal:inputReadOnly)+" text-xs py-1.5"} readOnly={!editandoLote}
                                    value={lote[f]??""} onChange={e=>setL(f,e.target.value)}/>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>

                  {/* servicios */}
                  <SectionCard icon={Building2} iconColor="text-teal-500" title="Servicios y Condición del Lote">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        {icon:Droplets, label:"Agua Potable",       field:"aguaPotable"},
                        {icon:Zap,      label:"Energía Eléctrica",  field:"energiaElectrica"},
                        {icon:Zap,     label:"Calle",              field:"calle"},
                        {icon:Shield,   label:"Seguridad",          field:"seguridad"},
                        {icon:Zap,    label:"Requiere Expensas",  field:"requiereExpensas"},
                        {icon:BadgeCheck,label:"Amojonado",         field:"amojonado"},
                        {icon:Check,    label:"Entregado",          field:"entregado"},
                        {icon:Check,    label:"Limpio",             field:"limpio"},
                        {icon:Building2,label:"Tiene Construcción", field:"tieneConstruccion"},
                      ].map(({icon,label,field})=>(
                        <ToggleChip key={field} icon={icon} label={label}
                          checked={!!lote[field]} onChange={()=>setL(field,!lote[field])}/>
                      ))}
                    </div>
                  </SectionCard>
                </>
              )}
            </>
          )}

          {/* ══ STEP 3 · RESUMEN ══ */}
          {step === 3 && (
            <>
              {!showPreview ? (
                <>
                  {[
                    {
                      title:"Comprador", icon:User, color:"text-blue-500",
                      rows:[
                        ["Nombre completo",`${cliente.nombre} ${cliente.apellido}`],
                        ["Cédula",cliente.cedula],
                        ["RUC",cliente.ruc],
                        ["Profesión",cliente.profesion],
                        ["Estado civil",cliente.estadoCivil],
                        ["Ciudad",cliente.ciudad],
                      ]
                    },
                    {
                      title:"Condiciones de Venta", icon:DollarSign, color:"text-emerald-500",
                      rows:[
                        ["Fecha de contrato",venta.fechaContrato],["Fecha de inicio",venta.fechaInicio],
                        ["Estado",venta.estado],["Monto total",`Gs. ${fmt(venta.montoTotal)}`],
                        ["En texto",venta.montoTexto],["Modalidad",venta.tipoPago],
                        ...(venta.tipoPago==="Credito"?[
                          ["Cuotas",`${venta.cantidadCuotas} × Gs. ${fmt(venta.montoCuota)}`],
                          ["Vencimiento",`Día ${venta.diaVencimiento}`],
                          ["Interés moratorio",`${venta.tasaInteresMoratorio}%`],
                          ["Multa diaria",`${venta.multaMoraDiaria}%`],
                        ]:[]),
                      ]
                    },
                    ...(lote?[{
                      title:"Lote", icon:MapPin, color:"text-purple-500",
                      rows:[
                        ["Fraccionamiento",lote.fraccionamiento],
                        ["Lote / Manzana",`L. ${lote.lote} — M. ${lote.manzana}`],
                        ["Finca / Padrón",`${lote.finca} / ${lote.padron}`],
                        ["Superficie",`${lote.superficie} m²`],
                      ]
                    }]:[])
                  ].map(card=>(
                    <div key={card.title} className="bg-gray-50 rounded-xl p-5">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-base">
                        <card.icon size={16} className={card.color}/>{card.title}
                      </h4>
                      <div className="divide-y divide-gray-200">
                        {card.rows.map(([label,value])=>value?(
                          <div key={label} className="flex justify-between items-baseline py-1.5 text-sm">
                            <span className="text-gray-500">{label}</span>
                            <span className={`font-medium text-gray-800 text-right max-w-xs ${label==="En texto"?"text-xs uppercase":""}`}>{value}</span>
                          </div>
                        ):null)}
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={()=>setShowPreview(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 bg-white hover:border-gray-400 hover:text-gray-800 transition-all px-4 py-2.5 rounded-lg">
                    <Eye size={15}/>Ver contrato completo
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <button type="button" onClick={()=>setShowPreview(false)}
                      className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-400 transition-all">
                      <ChevronLeft size={14}/>Volver al resumen
                    </button>
                    <button type="button"
                      onClick={()=>{
                        const el = document.getElementById("vf-contract-print");
                        if(!el) return;
                        const w = window.open("","_blank");
                        w.document.write(`<html><head><title>Contrato</title><style>body{font-family:Georgia,serif;max-width:780px;margin:2rem auto;font-size:12px;line-height:1.7;color:#111;}h2{text-align:center;}table{width:100%;border-collapse:collapse;font-size:11px;}td{padding:4px 8px;border:1px solid #ccc;}.grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;margin-top:3rem;}.line{border-top:1px solid #111;padding-top:.5rem;text-align:center;font-size:10px;text-transform:uppercase;margin-top:2.5rem;}strong{font-weight:600;}</style></head><body>${el.innerHTML}</body></html>`);
                        w.document.close(); w.print();
                      }}
                      className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-400 transition-all">
                      <Printer size={14}/>Imprimir / Guardar PDF
                    </button>
                  </div>
                  <div id="vf-contract-print">
                    <ContractPreview cliente={cliente} venta={venta} lote={lote}/>
                  </div>
                </>
              )}
            </>
          )}

          {/* footer */}
          <div className="flex justify-between items-center pt-5 border-t border-gray-100">
            <button type="button" onClick={step===0?onCancel:()=>setStep(s=>s-1)} disabled={loading}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-400 transition-all px-4 py-2.5 rounded-lg disabled:opacity-50">
              {step===0?<><X size={14}/>Cancelar</>:<><ChevronLeft size={14}/>Volver</>}
            </button>

            {step < 3
              ? <button type="button" onClick={()=>setStep(s=>s+1)}
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-700 transition-colors px-5 py-2.5 rounded-lg">
                  Siguiente<ChevronRight size={14}/>
                </button>
              : <button type="button" onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-300 transition-colors px-5 py-2.5 rounded-lg disabled:cursor-not-allowed">
                  {loading?<><Loader2 size={14} className="animate-spin"/>Guardando…</>:<><Check size={14}/>Crear Venta</>}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}