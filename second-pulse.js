module.exports = RED => {
	RED.nodes.registerType( 'second pulse', function( config ) {
		RED.nodes.createNode( this, config );

        let timestamp_previous = 0;
        let timestamp_now = 1;
        let second_uptime = 0;

        const start = () => {
            while (timestamp_now % 1000 !== 0) {
                timestamp_now = new Date().getTime();
            }
         
            pulse();
        }
        
        const clearDot = () => {
			      this.status({fill:"grey", shape:"dot", text: `UTC: ${timestamp_now}`});
        }

        const pulse = () => {
            let seconds_now = Math.floor(timestamp_now / 1000);
            let seconds_previous = Math.floor(timestamp_previous / 1000);
		
                
            while(seconds_now === seconds_previous) {
                timestamp_now = new Date().getTime();
                seconds_now = Math.floor(timestamp_now / 1000);
            }
            
            msg = {
                name: config.name,
                payload: true,
                timestamp: timestamp_now
            }

            timestamp_previous = timestamp_now;
            second_uptime++;
			      this.status({fill:"green", shape:"dot", text: `UTC: ${timestamp_now}`});
        
            this.send(msg);
        
            timeout = setTimeout(pulse,980);
            dotpulse = setTimeout(clearDot,500);
        }

        const stop = () => {
            clearTimeout( timeout );
            clearTimeout( dotpulse );
		};

		start();
		this.on( 'close', stop );
	} );
};
