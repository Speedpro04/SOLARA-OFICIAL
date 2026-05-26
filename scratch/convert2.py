import ast

sql_file = 'supabase_schema_partners.sql'
with open(sql_file, 'r', encoding='utf-8') as f:
    sql = f.read()

start_idx = sql.find('VALUES\n')
if start_idx == -1:
    start_idx = sql.find('VALUES\r\n')
if start_idx == -1:
    start_idx = sql.find('VALUES')

values_str = sql[start_idx+6:].split(';')[0].strip()

# Clean up any comments or weird stuff if present
values_str = '[' + values_str + ']'

try:
    data = ast.literal_eval(values_str)
    ts_array = 'export const partnersDataStatic: Partner[] = [\n'
    for row in data:
        id, name, spec, site, reg, loc, cat = row
        # Escape single quotes
        spec = spec.replace("'", "\\'")
        name = name.replace("'", "\\'")
        site = site.replace("'", "\\'")
        loc = loc.replace("'", "\\'")
        ts_array += f"  {{ id: '{id}', name: '{name}', specialty: '{spec}', site: '{site}', region: '{reg}', location: '{loc}', category_id: '{cat}' }},\n"
    ts_array += '];\n'
    
    with open('scratch/partners_array.ts', 'w', encoding='utf-8') as f:
        f.write(ts_array)
    print(f'Extracted {len(data)} partners')
except Exception as e:
    print('Error:', e)
