/**
 * A class that will hold all the constants used in the project
 */
class Config {
    //the location of the api
    API_LOCATION = 'http://localhost:5000/';

    /**
     * A function to replace the first letter of each word in a string with a capital letter
     * @param str - the string being turned into title case
     * @return the string passed in in title case
     */
    titleCase(str: string) {
        //split each string by white space
        let strArr: any = str.toLowerCase().split(' ');

        //iterate through string array
        for (let i = 0; i < str.length; i++) {
            //replace the first character in each string with its upper case letter
            strArr[i] = strArr[i] ? strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1) : null;
        }

        //return the string array joined back together with whitespace
        return strArr.join(' ');
    }
}

export default new Config();