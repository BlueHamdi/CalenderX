import React, { useState, useEffect } from 'react';
import { db, addEvent as addEvents, getEvents, deleteEvent as deleteEventFromDb } from './firebase'
import './App.css'

//delete events, add events and get events for a specific date
//skapa stories, epics och en prioriterad baclog

function App() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [events, setEvents] = useState([]);
  const [filterEvents, setFilterEvents] = useState([]);

  const fetchEvents = async () => {
    var allEvents = await getEvents()

    console.log("allEvents:", allEvents)

    setEvents(allEvents)
  }

  const filterEventsHandle = () => {
   var results = events.filter(event => event.date === dateFilter)
   console.log("results:", results)
   setFilterEvents(results)
  }

  useEffect(() => {
    fetchEvents()
  }, [])




  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const addEvent = async (event) => {
    try {
      await addEvents(event);
      const newEventsArr = [...events, event]
      setEvents(newEventsArr)
      console.log('Event added to Firestore:', event);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const deleteEvent = async (id) => {
    const remainingEvents = events.filter(event => event.id != id)
    console.log("id (delete):", id)
    console.log("remainingEvents (delete):", remainingEvents)
    await deleteEventFromDb(id)
    setEvents(remainingEvents)
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    if (title && date) {
      const eventObj = { title, date, startTime, endTime };
      addEvent(eventObj);
      setTitle('');
      setDate('');
      setStartTime('');
      setEndTime('');
    }
  };

  return (

    <div>
      <h1>CalenderX</h1>
      <div className='container'>

        <div>
          <form onSubmit={handleSubmit} className='form'>
            <input
              type="text"
              placeholder="Event title"
              value={title}
              onChange={handleTitleChange}
            />
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
            />

            <input
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
            />

            <input
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
            />
            <button type="submit">Add Event</button>
          </form>

        </div>
      </div>
      <div className='two'>
      <div className='eventsholder'>
        {events.map((item) => {
          return (
            <div  className='eventholder'>
              <div className='events'>
                <div>{item.title}</div>
                <div>{item.date}</div>
                <div>{item.startTime} - </div>
                <div>{item.endTime} </div>
              </div>
              <button onClick={() => deleteEvent(item.id)}>Delete Event</button>
            </div>

          )
        }
        )}

      </div>
      <div>
        <input
        
         type="date"
         value={dateFilter}
         onChange={(e) => setDateFilter(e.target.value)}
       />
        <button onClick={() => filterEventsHandle()}>search</button>
        {filterEvents.map((item) => {
          return (
            <div  className='eventholder'>
            <div className='events'>
              <div>{item.title}</div>
              <div>{item.date}</div>
            </div>
            <button onClick={() => deleteEvent(item.id)}>Delete Event</button>
          </div>

          )
        })}
        
      </div>
      </div>

    </div>
  );
}

export default App;
