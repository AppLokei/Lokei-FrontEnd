import "./Input.css";

const CampoEntrada = ({ rotulo, erro, acao, obrigatorio, ...props }) => (
  <label className="inputField">
    <span className="inputLabel">
      {rotulo}
      {obrigatorio && <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>}
    </span>
    <span className="inputControlWrapper">
      <input
        className={`inputControl${erro ? " inputControl--error" : ""}`}
        {...props}
      />
      {acao ? <span className="inputAction">{acao}</span> : null}
    </span>
    {erro ? <span className="inputError">{erro}</span> : null}
  </label>
);

export default CampoEntrada;
