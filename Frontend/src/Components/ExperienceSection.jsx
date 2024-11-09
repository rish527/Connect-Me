import { Briefcase, X } from 'lucide-react';
import React, { useState } from 'react'
import { formatDate } from '../../utils/dateUtils.js';

function ExperienceSection({userData, isOwnProfile, onSave}) {
  const [isEditing, setIsEditing]=useState(false);
  const [experience, setExperience] = useState(userData.experience || []);
  const [newExperience, setNewExperience] = useState({
    title:"",
    company:"",
    startDate:"",
    endDate:"",
    description:"",
    currentlyWorking:false,
  });

  const handleAddExperience=()=>{
    if(newExperience.title && newExperience.company && newExperience.startDate){
      setExperience([...experience, newExperience]);
      setNewExperience({
        title:"",
        company:"",
        startDate:"",
        endDate:"",
        description:"",
        currentlyWorking:false,
      });
    }
  };

  const handleDeleteExperience=(id)=>{
    setExperience(experience.filter((exp)=>exp._id !==id))
  }

  const handleSave=()=>{
    onSave({experience:experience});
    setIsEditing(false);
  };

  const handleCurrentlyWorkingChange=(e)=>{
    setNewExperience({
      ...newExperience,
      currentlyWorking:e.target.checked,
      endDate:e.target.checked?"":newExperience.endDate,
    });
  };


  return (
    <div className="shadow bg-white rounded-lg p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Experience</h2>
      {experience.map((exp)=>(
        <div key={exp._id} className="flex mb-4 justify-between items-start">
          <div className="flex items-start">
            <Briefcase size={20} className='mr-2 mt-1' />
            <div>
              <h3 className='font-semibold'>{exp.title}</h3>
              <p className='text-gray-600'>{exp.company}</p>
              <p className="text-hray-600 text-sm">
                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
              </p>
              <p className='text-gray-700'>{exp.description}</p>
            </div>
            {isEditing &&(
              <button onClick={()=>handleDeleteExperience(exp._id)} className='text-red-500'>
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      ))}

      {isEditing && (
        <div className="mt-4">
          <input 
            type="text" 
            placeholder='Title'
            value={newExperience.title}
            onChange={(e)=>setNewExperience({...newExperience,title:e.target.value})}
            className='w-full p-2 border rounded mb-2'
          />
          <input 
            type='text'
            placeholder='Company'
            value={newExperience.company}
            onChange={(e)=>setNewExperience({...newExperience, company:e.target.value})}
            className='w-full p-2 border rounded mb-2'

          />
          <input
						type='date'
						placeholder='Start Date'
						value={newExperience.startDate}
						onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
						className='w-full p-2 border rounded mb-2'
					/>
          <div className="flex items-center mb-2">
            <input 
              type="checkbox"
              id='currentlyWorking'
              checked={newExperience.currentlyWorking}
              onChange={handleCurrentlyWorkingChange}
              className='mr-2' 
            />
            <label htmlFor="currentlyWorking">I currently work here</label>
          </div>
          {!newExperience.currentlyWorking && (
						<input
							type='date'
							placeholder='End Date'
							value={newExperience.endDate}
							onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
							className='w-full p-2 border rounded mb-2'
						/>
					)}
          <textarea
						placeholder='Description'
						value={newExperience.description}
						onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
						className='w-full p-2 border rounded mb-2'
					/>
					<button
						onClick={handleAddExperience}
						className='bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300'
					>
						Add Experience
					</button>
        </div>
      )}

{isOwnProfile && (
				<>
					{isEditing ? (
						<button
							onClick={handleSave}
							className='mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300'
						>
							Save Changes
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className='mt-4 text-primary hover:text-primary-dark transition duration-300'
						>
							Edit Experiences
						</button>
					)}
				</>
			)}

    </div>
  )
}

export default ExperienceSection