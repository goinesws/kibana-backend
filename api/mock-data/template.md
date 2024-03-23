## Template SP di Model

    	let SP = `
        `;

    	try {
    		let result = await db.any(SP);

    		if (result.length < 1) {
    			return new Error("Gagal Mendapatkan Data.");
    		} else {
    			return result;
    		}
    	} catch (error) {
    		return new Error("Gagal Mendapatkan Data.");
    	}

## Template Buat Code di Controller (Butuh Login)

    let result = {};

    result.error_schema = {};
    result.output_schema = {};

    if (req.session.id == req.get("X-Token")) {

    } else {
    	result.error_schema = {
    		error_code: '403',
    		error_message: errorMessages.NOT_LOGGED_IN,
    	};
    	result.output_schema = {};
    }

    res.send(result);

## Template Pergantian X-Token & Session

    let x_token = req.get("X-Token");
    let UserInstance = new User();
    let curr_session = UserInstance.getUserSessionData(x_token);

    curr_session.session_id == x_token &&
    	curr_session.session_data.is_freelancer
