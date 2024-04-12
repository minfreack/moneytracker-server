const {db} = require("../../lib/firebase")

const newUser = async(data) => {
    try {
        const user = await db.collection('users').doc(data?.id).set(data, {merge: true});
        return {
            status: 200,
            data: {
                data: data?.id,
                success: true
            }
        }
    } catch (error) {
        return {
            status: 400,
            data: {
                data: data?.id,
                success: false,
                error
            },
            error
        }
    }
} 

const getUser = async(data) => {
    try {
        const querySnapshot = await db.collection('users').where('id', '==', data?.id).get()
            if (querySnapshot?.empty) {
                return {
                    status: 200,
                    data: {
                        data: data?.id,
                        error: 'El usuario con ese ID no existe',
                        success: false
                    }
                }
            }
            let userData = {}
            querySnapshot.forEach(doc => {
                userData = doc.data()
            });
            return {
                status: 200,
                data: {
                    data: userData,
                    success: true
                }
            }
    } catch (error) {
        return {
            status: 400,
            data: {
                data: data?.id,
                success: false,
                error
            },
            error,
        }
    }
} 

module.exports = {
    newUser,
    getUser
}