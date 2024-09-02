import React, {useState} from 'react';

export default function FlightSearchFormComponent({onSearch}){
    const[carrierCode, setCarrierCode] = useState('')
    const[flightNumber, setFlightNumber] = useState('')
    const[scheduledDepartureDate, setScheduledDepartureDate] = useState('')

    const handleSearch = (event)=>{
        event.preventDefault();
        if (carrierCode && flightNumber && scheduledDepartureDate){
            onSearch({carrierCode, flightNumber, scheduledDepartureDate});
            
        }
        else{
            alert("Enter all the details!");
        }
    }

    return (
        <form onSubmit={handleSearch}>
            <div>
                <label>Carrier Code</label>
                <input 
                    type='text' 
                    id="carrierCode" 
                    value={carrierCode} 
                    onChange={(e)=>setCarrierCode(e.target.value)} 
                    required
                >    
                </input>
            </div>
            <div>
            <label>Flight Number</label>
                <input 
                    type='text' 
                    id="flightNumber" 
                    value={flightNumber} 
                    onChange={(e)=>setFlightNumber(e.target.value)} 
                    required
                >    
                </input>
            </div>
            <div>
            <label>Scheduled Departure Date</label>
                <input 
                    type='text' 
                    id="scheduledDepartureDate" 
                    value={scheduledDepartureDate} 
                    onChange={(e)=>setScheduledDepartureDate(e.target.value)} 
                    required
                >    
                </input>
            </div>
            <button type="submit">Search Flight</button>
        </form>
    )
}