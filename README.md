# ToDo: 
- tavern - create feature
- blacksmithing - create layout, add basic functions

# Progress month:

1. Clear message box
2. Progress any active constructions and update value accordingly
3. Generate events
4. Unlocks recruitable units
5. Apply bonuses from the capital based on the capital's level
6. Updates the current building cost for any upgradeable building
7. Calculate available space for pops

8. Calculate resource gain / spend:
    a. Increase month
    b. Calculate gold gains / losses
    c. Calculate pop gains / losses (except from events)
    d. Calculate food gains / losses
    e. Calculate other resource gains (wood, stone, metals, runes....)

9. Generate messages regarding resource loss / gain
10. Check if pop is at or above max space. If the same, triggers the appropriate alert
11. Check food status. If the food is low and consumption is equal or higher than production, trigger appropriate alert
12. Recruit units
13. Check if enough gold to upkeep army. 
14. Calculate total might 
15. Calculate happines based on various conditions (taxes, alerts, etc.). If happiness is at 0, triggers 'Riot' event.
16. Re-generate DOM with the updated values, messages, alerts


# Notes on metal:

# Copper 
Can be mined and smelted into copper bar

# Bronze
Can be smelted from copper ore (needs smelter)

# Iron
Can be mined and smelted into iron bars

# Steel
Can be smelted from iron ore and coal (needs klin and smelter)

# Seranite
Can be mined and smelted into seratine bar (Blacksmith level 2)

# Magical: Dark Steel
Can be created by enchanting steel using runes (death? earth + fire?) (Blacksmith level 2, needs enchanter)

# Magical: Elementium
Can be created by enchanting seratine using runes (fire, water, air, earth) (Blacksmith level 3, needs enchanter)

# Magical: Dragonsteel
Can be created by enchanting steel using runes (dragonrune) (Blacksmith level 3, needs enchanter)

# Magical: Ethersteel
Cannot be produced, only looted from Etherials
  
