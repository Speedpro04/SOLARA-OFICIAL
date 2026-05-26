import re

sql_file = 'supabase_schema_partners.sql'
with open(sql_file, 'r', encoding='utf-8') as f:
    sql = f.read()

pattern = re.compile(r"\('(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)'\)")
matches = pattern.findall(sql)

ts_array = 'const hardcodedPartners: Partner[] = [\n'
for m in matches:
    id, name, spec, site, reg, loc, cat = m
    ts_array += f"  {{ id: '{id}', name: '{name}', specialty: '{spec}', site: '{site}', region: '{reg}', location: '{loc}', category_id: '{cat}' }},\n"
ts_array += '];\n'

with open('scratch/partners_array.ts', 'w', encoding='utf-8') as f:
    f.write(ts_array)
print(f"Extracted {len(matches)} partners")
