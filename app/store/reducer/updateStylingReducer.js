
import { UPDATE_COLOR_MODE, UPDATE_FONT_SIZE, UPDATE_VERSE_IN_LINE } from '../action/actionsType'

import { nightColors, dayColors } from '../../utils/colors.js'
import { extraSmallFont, smallFont, mediumFont, largeFont, extraLargeFont } from '../../utils/dimens.js'
import { AsyncStorageConstants } from '../../utils/AsyncStorageConstants.js'

const initialState = {
    colorMode: AsyncStorageConstants.Values.DayMode,
    sizeMode: AsyncStorageConstants.Values.SizeModeNormal,
    colorFile: dayColors,
    sizeFile: mediumFont,
    verseInLine: AsyncStorageConstants.Values.verseInLine,

}
function updateStyling(state = initialState, action) {
    switch (action.type) {
        case UPDATE_FONT_SIZE:
            const sizes = {
                sizeMode: () => {
                    switch (action.sizeMode) {
                        case AsyncStorageConstants.Values.SizeModeXSmall:
                            return {
                                ...state,
                                sizeMode: action.sizeMode,
                                sizeFile: extraSmallFont
                            }
                        case AsyncStorageConstants.Values.SizeModeSmall:
                            return {
                                ...state,
                                sizeMode: action.sizeMode,
                                sizeFile: smallFont

                            }
                        case AsyncStorageConstants.Values.SizeModeNormal:
                            return {
                                ...state,
                                sizeMode: action.sizeMode,
                                sizeFile: mediumFont

                            }
                        case AsyncStorageConstants.Values.SizeModeLarge:
                            return {
                                ...state,
                                sizeMode: action.sizeMode,
                                sizeFile: largeFont

                            }
                        case AsyncStorageConstants.Values.SizeModeXLarge:
                            return {
                                ...state,
                                sizeMode: action.sizeMode,
                                sizeFile: extraLargeFont

                            }
                        default:
                            return {
                                ...state,
                            }

                    }
                }
            }
            return sizes.sizeMode()

        case UPDATE_COLOR_MODE:
            const colors = {
                switchColor: () => {
                    switch (action.colorMode) {
                        case AsyncStorageConstants.Values.DayMode:
                            return {
                                ...state,
                                colorMode: action.colorMode,
                                colorFile: dayColors,

                            }
                        case AsyncStorageConstants.Values.NightMode:
                            return {
                                ...state,
                                colorMode: action.colorMode,
                                colorFile: nightColors,
                            }
                        default:
                            return {
                                ...state,
                            }


                    }
                }
            }
            return colors.switchColor()
        case UPDATE_VERSE_IN_LINE:
            return {
                ...state,
                verseInLine: action.verseInLine
            }

        default:
            return state

    }

}

export default updateStyling