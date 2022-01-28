function createMachine(stateMachineDefinition) {
  const machine = {
    // machine object
  }
  return machine
}

// here's how we'll create the state machine
const machine = createMachine({
  initialState: 'off',

  off:{
    transitions: {
      switch: {
        target: 'standby',
      },
    },
  },

  standby:{
    transitions: {
      switch: {
        target: 'connected',
      },
    },
  },

  connected:{
    
    request:{},

    terminate:{

      transitions: {
        switch: {
          target: 'save_video',
        },
      },

      save_video:{
        transitions: {
          switch: {
            target: 'off',
          },
        },
      },
    },

  },
 

  
  
})

// here's how we use the state machine
// comments are what we _want_ to have logged
let state = machine.value