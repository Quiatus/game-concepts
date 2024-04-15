
# Progress month:

1. Clear message box
2. Progress any active constructions and update value accordingly
3. Unlocks recruitable units
4. Apply bonuses from the capital based on the capital's level
5. Updates the current building cost for any upgradeable building
6. Calculate available space for pops
7. Generate and display events

8. Calculate resource gain / spend:
    a. Increase month
    b. Calculate gold gains / losses
    c. Calculate pop gains / losses (except from events)
    d. Calculate food gains / losses
    e. Calculate other resource gains (wood, stone, metals, runes....)

9. Print resource gain / loss messages
10. Check if pop is at or above max space. If the same, triggers the appropriate alert
11. Check if food status. If the food is low and consumption is equal or higher than production, trigger appropriate alert
12. If there are units in queue, recruit them
13. Check if enough gold to upkeep army. 
14. Calculate total might 
15. Calculate happines based on various conditions (taxes, alerts, etc.). If happiness is at 0, triggers 'Riot' event.
16. Displays all active alerts
17. Show menu buttons based on unlocked features
18. Re-generate DOM with the updated values


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