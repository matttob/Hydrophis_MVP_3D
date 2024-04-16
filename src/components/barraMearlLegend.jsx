
export default function barraMearlLegend()
{
return (
<div className="barralegend" id="mapLegend">
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: 'grey'}}></div>
    <div>Bedrock</div>
  </div>
  <div className="legend-item">
    <div className="legend-color" style={{ backgroundColor: ' #FFE4C4'}}></div>
    <div> &lt; 5% Maerl</div>
  </div>
  <div className="legend-item">
    <div className="legend-color"  style={{ backgroundColor: 'pink'}}></div>
    <div>&lt; 25% Maerl</div>
  </div>
  <div className="legend-item">
    <div className="legend-color"  style={{backgroundColor: 'orange'}}></div>
    <div>&lt; 50% Maerl</div>
  </div>
  <div className="legend-item">
    <div className="legend-color"  style={{ backgroundColor: 'red'}}></div>
    <div>&gt; 50% Maerl</div>
  </div>
</div>)}

