import React, { useState, useEffect } from "react";
import axios from "../../config/axiosInstance";

import Header from "../Shared/Header";
import Category from "./Category";

import userInstance from "../../config/userInstance";

function Roles() {
  const [ user, setUser ] = useState( userInstance );
  const [ usersRoles, setUsersRoles ] = useState( [] );

  const [ all, setAll ] = useState( [] );
  const [ roles, setRoles ] = useState( [] );
  const [ cats, setCats ] = useState( [] );

  const [ add, setAdd ] = useState( [] );
  const [ remove, setRemove ] = useState( [] );

  const [ loading, setLoading ] = useState( true );
  const [ submitted, setSubmitted ] = useState( true );
  const [ err, setErr ] = useState( true );

  useEffect( () => {
    const fetchData = async () => {
      const fetchUser = ( await
        axios.get( '/api/user' )
      ).data;
      setUser( fetchUser );
      
      if ( fetchUser && fetchUser.id ) {
        const fetchCats = ( await
          axios.get( '/notion/categories' )
        ).data;
        setCats( fetchCats );

        const fetchRoles = ( await
          axios.get( '/api/roles' )
        ).data;
        setAll( fetchRoles );
        setLoading( false );
      };

      await fetchSetUserRoles( fetchUser.id );
    };

    fetchData();
  }, [] );

  useEffect( () => { 
    setRoles( availableRoles() );    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ usersRoles ] );

  const fetchSetUserRoles = async ( userId ) => {
    if ( !userId ) { return false; };
    const fetch = ( await
      axios.get( `/api/user-roles/${ userId }` )
    ).data;
    setUsersRoles( fetch );
  };

  const availableRoles = ( outer = all, inner = usersRoles ) => 
    outer.filter( han => 
      !inner.find( solo => han.name === solo.name ) 
    );

  const reset = async ( theUser = user ) => {
    setAdd( [] );
    setRemove( [] );
    await fetchSetUserRoles( theUser.id );
  };

  const handleSubmit = async ( e ) => {
    const result = await axios.post( '/api/process', { 
      userId: user.id, 
      add, 
      remove 
    } );
    if ( result.status === 200 ) {
      // Reset
      await reset();
      setSubmitted( true );
      setTimeout( () => 
        setSubmitted( false ), 6000 
      );
    } else {
      const status = result.status ? result.status : 'Unknown :/';
      setErr( status );
      setTimeout( () => 
        setErr( false ), 4000 
      );
    };
  };

  const handleCancel = async ( e ) => {
    setLoading( true );
    await reset();
    setLoading( false );
  };

  const handleAddRole = ( role ) =>
    setAdd( prev => prev.push( role ) );

  const handleRemoveRole = ( role ) => 
    setRemove( prev => prev.push( role ) );

  return (
  <div className="container">
    <Header 
      user={ user } 
    />
    <div className="section">
      
      { submitted && 
      <div>
        Successfully submitted changes!
      </div>
      }
      { err && 
      <div>
        Sorry. An error occured. Got an HTTP Status Code of { err } 
      </div>
      }

      <h4>
        Your Channel & Role Options, { user && user.username } 
      </h4>
      <div 
        id="controls"
        className="section text-center" 
      >
        <button 
          id="submit-changes" 
          className="btn btn-outline-primary" 
          onClick={ handleSubmit }
        >
          Submit Changes
        </button>
        <button 
          id="reset" 
          className="btn btn-outline-danger" 
          onClick={ handleCancel }
        >
          Cancel
        </button>
        {/* div#controls */}
      </div>
    {/* div.section */}
    </div>

    <div className="section">
      <Category 
        name="Current" 
        roles={ usersRoles } 
        handleRole={ handleRemoveRole } 
        loading={ loading } 
      />
    {/* div.section */}
    </div>

    <div className="section">
      <Category 
        name="To Add" 
        roles={ add } 
        handleRole={ handleRemoveRole } 
        loading={ loading } 
      />
    {/* div.section */}
    </div>

    <div className="section">
      <Category 
        name="To Remove" 
        roles={ remove } 
        handleRole={ handleAddRole } 
        loading={ loading } 
      />
    {/* div.section */}
    </div>

    <hr />

    <div className="section">
    { 
      cats.map( cat =>  ( 
        <Category 
          category={ cat }
          name={ cat.name } 
          roles={ roles } 
          handleRole={ handleAddRole } 
          loading={ loading } 
        />
      ) ) 
    }
    {/* div.section */}
    </div>
  {/* div.container */}
  </div>
  );
};

export default Roles;