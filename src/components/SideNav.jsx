import { C } from '../data/constants.js';

export function SideNav({ page, setPage, role }) {
  const sItems = [
    {label:"Dashboard",icon:"🏠"},{label:"Home",icon:"🏠"},
    {label:"Course",icon:"📚"},{label:"Quiz",icon:"📝"},
    {label:"Grade Book",icon:"📊"},{label:"Forum",icon:"💬"},
    {label:"Assignment",icon:"�"},{label:"Studio",icon:"🎬"},
    {label:"Extras",icon:"➕"},
  ];
  const lItems = [
    {label:"Dashboard",icon:"🏠"},{label:"Home",icon:"🏠"},
    {label:"Course",icon:"📚"},{label:"Quiz",icon:"�"},
    {label:"Grade Book",icon:"📊"},{label:"Forum",icon:"💬"},
    {label:"Assignment",icon:"�"},{label:"Studio",icon:"🎬"},
    {label:"Extras",icon:"➕"},
  ];
  const aItems = [
    {label:"Dashboard",icon:"🏠"},{label:"Home",icon:"🏠"},
    {label:"Course",icon:"📚"},{label:"Quiz",icon:"📝"},
    {label:"Grade Book",icon:"📊"},{label:"Forum",icon:"�"},
    {label:"Assignment",icon:"�"},{label:"Studio",icon:"🎬"},
    {label:"Extras",icon:"➕"},
  ];
  const items = role==="admin"?aItems:role==="lecturer"?lItems:sItems;
  
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {items.map(item=>{
            const key=item.label.toLowerCase();
            const active=page===key;
            return (
              <button 
                key={key} 
                onClick={()=>setPage(key)} 
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-fit
                  ${active 
                    ? 'bg-abu-blue text-white' 
                    : 'text-gray-600 hover:text-abu-blue hover:bg-blue-50'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
